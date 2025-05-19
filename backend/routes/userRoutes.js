const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// 📌 İzleme listesine ekleme / kaldırma
router.post("/watchlist", authMiddleware, async (req, res) => {
    try {
        let { movieId, title, poster_path } = req.body;
        const userId = req.user.id;

        console.log("✅ [LOG] Gelen istek verisi:", req.body);

        if (!movieId || !title || !poster_path) {
            console.error("❌ [HATA] Eksik film bilgisi!");
            return res.status(400).json({ message: "Eksik film bilgisi." });
        }

        movieId = String(movieId);

        const user = await User.findById(userId);

        if (!user) {
            console.error("❌ [HATA] Kullanıcı bulunamadı!");
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        if (!user.watchlist) {
            user.watchlist = [];
        }

        console.log("📌 Kullanıcının mevcut izleme listesi:", user.watchlist);

        const alreadyInWatchlistIndex = user.watchlist.findIndex((movie) => String(movie.movieId) === movieId);

        if (alreadyInWatchlistIndex !== -1) {
            user.watchlist.splice(alreadyInWatchlistIndex, 1);
            await user.save();
            console.log("❌ Film izleme listesinden çıkarıldı:", user.watchlist);
            return res.status(200).json({ message: "Film izleme listesinden çıkarıldı.", watchlist: user.watchlist });
        } else {
            user.watchlist.push({ movieId, title, poster_path });
            await user.save();
            console.log("✅ Film izleme listesine eklendi:", user.watchlist);
            return res.status(200).json({ message: "Film izleme listesine eklendi!", watchlist: user.watchlist });
        }
    } catch (error) {
        console.error("🚨 [HATA] İzleme listesi işlemi sırasında hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası.", error: error.message });
    }
});

// 📌 Kullanıcının izleme listesini getir
router.get("/watchlist", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            console.error("❌ [HATA] Kullanıcı bulunamadı!");
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        if (!user.watchlist) {
            user.watchlist = [];
        }

        console.log("📌 İzleme listesi getirildi:", user.watchlist);
        res.status(200).json(user.watchlist);
    } catch (error) {
        console.error("🚨 [HATA] İzleme listesi alınırken hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası.", error: error.message });
    }
});

// 📌 Multer ayarları (Yüklenen dosyalar 'uploads/' klasörüne kaydedilecek)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

// 📌 Profil fotoğrafı yükleme
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Dosya yüklenemedi!" });
        }

        console.log("📸 Yüklenen Dosya:", req.file);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        user.avatarUrl = `/uploads/${req.file.filename}`;
        await user.save();

        console.log("✅ Profil Fotoğrafı Güncellendi:", user.avatarUrl);

        res.status(200).json({ message: "Profil fotoğrafı güncellendi!", avatarUrl: user.avatarUrl, user });
    } catch (error) {
        console.error("🚨 Profil fotoğrafı yüklenirken hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

module.exports = router;
