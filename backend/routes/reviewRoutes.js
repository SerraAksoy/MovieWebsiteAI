const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review"); // Eğer böyle bir model yoksa oluşturmalısın
const authMiddleware = require("../middleware/authMiddleware");

// 📌 Yeni yorum ekleme
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { movieId, username, rating, comment } = req.body;
        const userId = req.user.id;

        if (!movieId || !username || !rating || !comment) {
            return res.status(400).json({ message: "Eksik bilgi. Lütfen tüm alanları doldurun." });
        }

        const newReview = new Review({
            movieId,
            userId,
            username,
            rating,
            comment,
            createdAt: new Date(),
        });

        await newReview.save();
        return res.status(201).json({ message: "Yorum başarıyla eklendi.", review: newReview });
    } catch (error) {
        console.error("🚨 Yorum eklerken hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

// 📌 Belirli bir filmin yorumlarını getir
router.get("/:movieId", async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });

        return res.status(200).json(reviews);
    } catch (error) {
        console.error("🚨 Yorumları çekerken hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

module.exports = router;