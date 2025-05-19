"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Recommendation {
    movie_id: string;
    predicted_rating: number;
    title: string;
}

export default function RecommendationsPage() {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Eğer kullanıcı giriş yapmamışsa, hata mesajı gösterelim
        if (!user) {
            setError("Lütfen giriş yapınız.");
            setLoading(false);
            return;
        }

        // Kullanıcı ID'sini AuthContext'ten alalım (kullanıcı modelinize göre _id veya id olabilir)
        const userId = user?._id || user?._id || "";
        const url = `http://localhost:5001/api/recommendations?userId=${userId}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ağ hatası: " + res.status);
                }
                return res.json();
            })
            .then((data) => {
                // API'den gelen veri örneğin şu formatta:
                // {
                //   "346296": {"predicted_rating": 5.0, "title": "Kırımlı"},
                //   "105": {"predicted_rating": 5.0, "title": "Geleceğe Dönüş"},
                //    ...
                // }
                const recs: Recommendation[] = Object.entries(data).map(
                    ([movie_id, details]) => ({
                        movie_id,
                        predicted_rating: Number((details as any).predicted_rating),
                        title: (details as any).title,
                    })
                );
                setRecommendations(recs);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Öneriler alınırken hata:", err);
                setError("Öneri sonuçları alınırken hata oluştu.");
                setLoading(false);
            });
    }, [user]);

    if (loading) return <div>Öneriler yükleniyor...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Kişiye Özel Önerilen Filmler</h1>
            <ul className="space-y-2">
                {recommendations.map((rec) => (
                    <li key={rec.movie_id} className="border p-2 rounded">
                        <strong>{rec.title}</strong> (ID: {rec.movie_id}) - Tahmini Puan: {rec.predicted_rating}
                    </li>
                ))}
            </ul>
        </div>
    );
}