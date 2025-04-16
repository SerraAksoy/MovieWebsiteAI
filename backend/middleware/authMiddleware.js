const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Yetkilendirme reddedildi. Giriş yapın." });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Kullanıcı ID'sini request objesine ekliyoruz
        next();
    } catch (error) {
        res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
    }
};

module.exports = authMiddleware;