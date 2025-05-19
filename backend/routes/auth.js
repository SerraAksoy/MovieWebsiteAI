const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Kullanıcı kayıt rotası
router.post('/register', async (req, res) => {
    const { username, email, password, avatarUrl } = req.body;

    try {
        // Kullanıcının zaten kayıtlı olup olmadığını kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
        }

        // Yeni kullanıcı oluştur
        const newUser = new User({ username, email, password, avatarUrl });
        await newUser.save();

        // JWT token oluştur
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Kullanıcı başarıyla kaydedildi.',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatarUrl: newUser.avatarUrl || ""
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.' });
    }
});


// Kullanıcı giriş rotası
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Gelen Giriş İsteği:", req.body); // Gelen isteği kontrol et

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.error("Kullanıcı bulunamadı!");
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.error("Yanlış şifre!");
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        console.log("Dönen Token:", token); // Token'ın oluşturulduğunu kontrol et

        res.status(200).json({
            message: "Giriş başarılı!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl || ""
            }
        });
    } catch (error) {
        console.error("Giriş sırasında hata oluştu:", error);
        res.status(500).json({ message: "Sunucu hatası. Lütfen tekrar deneyin." });
    }
});
module.exports = router;