"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import axios from "axios";

interface MovieDetail {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    genres: { id: number; name: string }[];
    cast: { id: number; name: string }[];
}

interface Review {
    userId: string;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function MovieDetailPage() {
    const { user } = useAuth();
    const params = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [comment, setComment] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;


    const movieId = params?.id ? String(params.id) : null;
    useEffect(() => {
        if (!movieId) return;

        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=tr-TR&append_to_response=credits`
                );
                setMovie({
                    ...response.data,
                    cast: response.data.credits?.cast?.slice(0, 10) || [],
                });
            } catch (error) {
                console.error("Film detayları yüklenirken hata oluştu:", error);
            }
        };
        fetchMovieDetails();
    }, [movieId, API_KEY]);

    useEffect(() => {
        if (!user || !movieId) return;

        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:5001/api/users/watchlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setWatchlist(response.data.map((m: any) => String(m.movieId)));
            } catch (error) {
                console.error(" İzleme listesi yüklenirken hata oluştu:", error);
            }
        };

        fetchWatchlist();
    }, [user, movieId]);

    const handleWatchlist = async () => {
        if (!user) {
            alert("İzleme listesine eklemek için giriş yapmalısınız!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.post(
                "http://localhost:5001/api/users/watchlist",
                { movieId, title: movie?.title, poster_path: movie?.poster_path },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWatchlist(response.data.watchlist.map((m: any) => String(m.movieId)));
        } catch (error: any) {
            console.error("🚨 İzleme listesi hatası:", error);
            alert(error.response?.data?.message || "Bir hata oluştu.");
        }
    };

    useEffect(() => {
        if (!movieId) return;

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/reviews/${movieId}`);
                setReviews(response.data);
            } catch (error) {
                console.error(" Yorumlar yüklenirken hata oluştu:", error);
            }
        };

        fetchReviews();
    }, [movieId]);

    const handleCommentSubmit = async () => {
        if (!user) {
            alert("Yorum yapabilmek için giriş yapmalısınız!");
            return;
        }

        if (!comment.trim() || rating === 0) {
            alert("Lütfen yorum ve puan giriniz!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.post(
                "http://localhost:5001/api/reviews", // Burada `/api/reviews` endpointi backend ile uyumlu olmalı
                {
                    movieId,
                    username: user.username,
                    rating,
                    comment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReviews((prev) => [response.data.review, ...prev]);
            setComment("");
            setRating(0);
        } catch (error: any) {
            console.error(" Yorum eklenirken hata oluştu:", error);
            alert(error.response?.data?.message || "Sunucu hatası oluştu.");
        }
    };

    if (!movie) {
        return <div className="text-center mt-10">🚀 Film detayları yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-6">

                <div className="md:w-1/3">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>


                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{movie.title}</h1>
                    <p className="mt-2">{movie.overview || "Açıklama bulunamadı."}</p>


                    <div className="mt-4">
                        <strong>Türler: </strong>
                        {movie.genres.length > 0
                            ? movie.genres.map((genre) => (
                                <span key={genre.id} className="badge badge-outline mx-1">
                                      {genre.name}
                                  </span>
                            ))
                            : "Tür bilgisi yok."}
                    </div>


                    <div className="mt-4">
                        <strong>Oyuncular: </strong>
                        {movie.cast.length > 0
                            ? movie.cast.map((actor) => (
                                <span key={actor.id} className="badge badge-outline mx-1">
                                      {actor.name}
                                  </span>
                            ))
                            : "Oyuncu bilgisi bulunamadı."}
                    </div>


                    <button
                        onClick={handleWatchlist}
                        className={`mt-4 btn ${watchlist.includes(String(movie.id)) ? "btn-primary text-white" : "btn-primary text-white"}`}
                    >
                        {watchlist.includes(String(movie.id)) ? "İzleme Listesinden Çıkar" : "İzleme Listesine Kaydet"}
                    </button>


                    <div className="mt-6">
                        <strong>Değerlendir:</strong>
                        <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`text-2xl mx-1 ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="textarea textarea-bordered w-full mt-2"
                            rows={3}
                            placeholder="Yorumunuzu yazın..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button onClick={handleCommentSubmit} className="btn btn-primary text-white mt-2">
                            Yorum Yap
                        </button>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-bold">Kullanıcı Yorumları</h2>

                        {reviews.length > 0 ? (
                            reviews.map((r, index) => (
                                <div key={index} className="border p-2 rounded-lg my-2">
                                    <strong>{r.username || "Anonim Kullanıcı"}</strong>: {r.comment} ⭐ {r.rating}
                                </div>
                            ))
                        ) : (
                            <p>Henüz yorum yapılmamış.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}