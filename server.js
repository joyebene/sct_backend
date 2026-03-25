require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const routeRoutes = require('./routes/route');
const bookingRoutes = require('./routes/booking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for development
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Smart Campus Transport Backend Running!');
});


app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Student joins a room for a specific bus
    socket.on('join-bus-room', (busId) => {
        console.log(`Socket ${socket.id} joining room ${busId}`);
        socket.join(busId);
    });

    // Driver sends location
    socket.on('sendLocation', (data) => {
        // data should contain { busId, lat, lng }
        console.log('Location received:', data);
        // Emit to the specific bus room
        io.to(data.busId).emit('locationUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});