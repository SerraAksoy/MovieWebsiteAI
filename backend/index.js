const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
    res.send('Backend API is running...');
});

// Sunucu başlat
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Auth rotalarını ekle
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);