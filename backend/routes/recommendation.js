const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.get('/recommendations', (req, res) => {
    // Sorgu parametresinden kullanıcı ID'sini alalım. (Örn: ?userId=678e4b3ad391c468d106f384)
    const userId = req.query.userId || ''; // Eğer gelmezse boş string olarak

    // Python script'ini, kullanıcı ID'sini argüman olarak vererek çalıştırıyoruz.
    const pythonProcess = spawn('python3', ['recommendation.py', userId], {
        cwd: path.join(__dirname, "../analysis")
    });

    let dataToSend = "";

    pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        try {
            const output = JSON.parse(dataToSend);
            res.json(output);
        } catch (error) {
            console.error("JSON parse hatası: ", error);
            res.status(500).json({ error: "Öneri sonuçları işlenirken hata oluştu." });
        }
    });
});

module.exports = router;