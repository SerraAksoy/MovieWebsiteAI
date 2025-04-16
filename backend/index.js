const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require("./routes/reviewRoutes"); // 📌 Yeni eklenen route
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");
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

// Auth rotalarını ekle
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.use("/api/reviews", reviewRoutes);
// `uploads/` klasörünü statik dosya olarak sun
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const recommendationRouter = require('./routes/recommendation');
app.use('/api', recommendationRouter);

// Sadece bir kez app.listen çağırıyoruz
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});