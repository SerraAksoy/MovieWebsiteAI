"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Movie {
    movieId: string;
    id?: number;
    title: string;
    poster_path: string;
}

export default function Profile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [watchlist, setWatchlist] = useState<Movie[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchWatchlist = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get("http://localhost:5001/api/users/watchlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setWatchlist(response.data);
            } catch (error) {
                console.error("🚨 İzleme listesi yüklenirken hata oluştu:", error);
            }
        };

        fetchWatchlist();
    }, [user]);

    const handleWatchlist = async (movie: Movie) => {
        if (!user) {
            alert("Filmi izleme listesinden çıkarmak için giriş yapmalısınız!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Yetkilendirme hatası! Lütfen giriş yapın.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5001/api/users/watchlist",
                {
                    movieId: String(movie.movieId || movie.id),
                    title: movie.title,
                    poster_path: movie.poster_path,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWatchlist(response.data.watchlist);
        } catch (error: any) {
            console.error("🚨 İzleme listesi hatası:", error);
            alert(error.response?.data?.message || "Bir hata oluştu.");
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <p>Yönlendiriliyorsunuz...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="card bg-base-100 shadow-xl p-6 mb-6 flex flex-col items-center text-center">
                <div className="avatar">
                    <div className="w-24 rounded-full border-2 border-gray-300">
                        <img
                            src={user?.avatarUrl ? `http://localhost:5001${user.avatarUrl}` : "/owl.png"}
                            alt="Profil Fotoğrafı"
                            className="w-24 h-24 rounded-full shadow-md"
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mt-3">{user?.username}’ın Profili</h2>
                <p className="text-gray-500">{user?.email}</p>

                <div className="flex gap-4 mt-4">
                    <button onClick={() => router.push("/profile/edit")} className="btn btn-outline btn-secondary btn-sm">
                        Profili Düzenle
                    </button>
                    <button onClick={() => { logout(); router.push("/login"); }} className="btn btn-primary text-white btn-sm">
                        Çıkış Yap
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">🎬 İzleme Listesi</h3>
                {watchlist.length === 0 ? (
                    <p className="text-gray-500 text-center">Henüz izleme listesine eklenen film yok.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                        {watchlist.map((movie) => (
                            <div key={movie.movieId} className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105">
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    width={300}
                                    height={450}
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-4 text-white flex flex-col items-center transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                                    <h2 className="font-semibold text-md mb-2 text-center">{movie.title}</h2>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            className="btn btn-sm btn-secondary text-white"
                                            onClick={() => handleWatchlist(movie)}
                                        >
                                            İzleme Listesinden Çıkar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary btn-outline text-white hover:text-white"
                                            onClick={() => router.push(`/movies/${movie.movieId}`)}
                                        >
                                            Detaylı Gör
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
