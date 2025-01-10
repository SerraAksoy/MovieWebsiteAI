const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Kullanıcı kayıt rotası
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kullanıcının zaten kayıtlı olup olmadığını kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email zaten kullanılıyor.' });
        }

        // Yeni kullanıcı oluştur
        const newUser = new User({ username, email, password });
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
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.' });
    }
});


// Kullanıcı giriş rotası
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz şifre.' });
        }

        // JWT token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Giriş başarılı.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.' });
    }
});
module.exports = router;