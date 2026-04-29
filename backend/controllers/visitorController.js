const Visitor = require("../models/Visitor");
const axios = require("axios");
const { UAParser } = require("ua-parser-js");


const trackVisitor = async (req, res) => {
  try {
    const { visitorId, path, userAgent, externalIp } = req.body;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Clean up IP
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.0.0.1')) {
       // Use client-side detected IP if available in dev environment
       ip = externalIp || '103.117.159.0'; // Fallback to a generic India IP if everything fails in dev
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    let visitor = await Visitor.findOne({ visitorId });

    // Extract device details
    const deviceInfo = {
      userAgent,
      device: result.device.type || "desktop",
      browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
      os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
      lastVisit: new Date(),
      ip
    };

    if (!visitor) {
      // Fetch Geo Data
      let geoData = {
        country: 'India',
        city: 'Unknown',
        region: 'Unknown'
      };
      
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
        if (response.data.status === 'success') {
          geoData = {
            country: response.data.country,
            city: response.data.city,
            region: response.data.regionName,
            timezone: response.data.timezone
          };
        }
      } catch (err) {
        console.error("Geo lookup failed:", err.message);
      }

      visitor = new Visitor({
        visitorId,
        ...deviceInfo,
        ...geoData,
        pagesVisited: [{ path }],
        visitCount: 1
      });
    } else {
      // Update existing visitor with latest info
      visitor.visitCount += 1;
      visitor.pagesVisited.push({ path });
      
      // Update device info in case they switched or updated browser
      Object.assign(visitor, deviceInfo);

      // Refresh geo data if IP changed significantly or missing
      if (visitor.ip !== ip || !visitor.country) {
        try {
          const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
          if (response.data.status === 'success') {
            visitor.country = response.data.country;
            visitor.city = response.data.city;
            visitor.region = response.data.regionName;
            visitor.timezone = response.data.timezone;
          }
        } catch (err) {}
      }
    }

    await visitor.save();
    res.status(200).json({ success: true, visitor });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).json({ error: "Tracking failed" });
  }
};

const updateTimeSpent = async (req, res) => {
  try {
    const { visitorId, path, timeSpent } = req.body;
    const visitor = await Visitor.findOne({ visitorId });
    
    if (visitor) {
      // Find the last visit to this path and update timeSpent
      const lastPageVisit = [...visitor.pagesVisited].reverse().find(p => p.path === path);
      if (lastPageVisit) {
        lastPageVisit.timeSpent += timeSpent;
        await visitor.save();
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

const trackClick = async (req, res) => {
  try {
    const { visitorId, path, x, y, element } = req.body;
    const visitor = await Visitor.findOne({ visitorId });
    
    if (visitor) {
      visitor.clicks.push({ path, x, y, element });
      await visitor.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Click tracking failed" });
  }
};

const getStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const onlineVisitors = await Visitor.countDocuments({ isOnline: true });
    const topPages = await Visitor.aggregate([
      { $unwind: "$pagesVisited" },
      { $group: { _id: "$pagesVisited.path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ totalVisitors, onlineVisitors, topPages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisit: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
};

module.exports = {
  trackVisitor,
  updateTimeSpent,
  trackClick,
  getStats,
  getAllVisitors
};
