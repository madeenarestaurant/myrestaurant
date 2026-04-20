const Visitor = require("../models/Visitor");
const axios = require("axios");
const { UAParser } = require("ua-parser-js");


const trackVisitor = async (req, res) => {
  try {
    const { visitorId, path, userAgent, screenResolution } = req.body;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Handle localhost case
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '8.8.8.8'; // Default to Google DNS IP for geo-lookup test in dev
    } else {
      ip = ip.split(',')[0].trim();
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    let visitor = await Visitor.findOne({ visitorId });

    if (!visitor) {
      // Fetch Geo Data
      let geoData = {};
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
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
        ip,
        ...geoData,
        userAgent,
        device: result.device.type || "desktop",
        browser: `${result.browser.name} ${result.browser.version}`,
        os: `${result.os.name} ${result.os.version}`,
        pagesVisited: [{ path }],
        visitCount: 1,
        lastVisit: new Date()
      });
    } else {
      visitor.visitCount += 1;
      visitor.lastVisit = new Date();
      visitor.pagesVisited.push({ path });
      visitor.ip = ip; // Update IP in case it changed
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

module.exports = {
  trackVisitor,
  updateTimeSpent,
  trackClick,
  getStats
};
