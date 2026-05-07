const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const http = require('http');
const socketIo = require('socket.io');
const Visitor = require('./models/Visitor');
const allowedOrigins = [
  'https://madeenarestaurant.com',
  'https://admin.madeenarestaurant.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:8080'
];


const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const menuImageRoutes = require('./routes/menuImageRoutes');

connectDB().then(async () => {
  try {
    await Visitor.updateMany({}, { isOnline: false });
    console.log('All visitors reset to offline status');
  } catch (err) {
    console.error('Failed to reset visitor status:', err);
  }
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/menu-images', menuImageRoutes);

io.on('connection', (socket) => {
  socket.on('visitor_connected', async (visitorId) => {
    socket.visitorId = visitorId;
    await Visitor.findOneAndUpdate(
      { visitorId }, 
      { isOnline: true },
      { upsert: true, new: true }
    );
    const onlineCount = await Visitor.countDocuments({ isOnline: true });
    io.emit('online_count', onlineCount);
  });

  socket.on('disconnect', async () => {
    if (socket.visitorId) {
      await Visitor.findOneAndUpdate({ visitorId: socket.visitorId }, { isOnline: false });
      const onlineCount = await Visitor.countDocuments({ isOnline: true });
      io.emit('online_count', onlineCount);
    }
  });
  
  Visitor.countDocuments({ isOnline: true }).then(count => {
    socket.emit('online_count', count);
  });
});

app.get('/', (req, res) => {
  res.send('Madeena Restaurant API is running...');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

