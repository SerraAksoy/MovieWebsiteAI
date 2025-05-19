"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
// useSearchParams için bileşen:
function SearchQueryHandler({ onQuery }: { onQuery: (query: string) => void }) {
  'use client';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useSearchParams } = require("next/navigation");
  const { useEffect } = require("react");
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query");

  useEffect(() => {
    if (queryParam) {
      onQuery(queryParam);
    }
  }, [queryParam, onQuery]);

  return null;
}
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}

interface Recommendation {
    movie_id: string;
    predicted_rating: number;
    title: string;
    poster_path: string;
    overview: string;
    poster_url?: string;
}

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const [showPosterUpload, setShowPosterUpload] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [posterRecommendations, setPosterRecommendations] = useState<Recommendation[]>([]);
    const [firstPosterRecommendation, setFirstPosterRecommendation] = useState<Recommendation | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const recommendationScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        AOS.init();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error("Film listesi yüklenirken hata oluştu:", error);
            }
        };
        fetchMovies();
    }, [API_KEY]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!user) return;
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await axios.get("http://localhost:5001/api/users/watchlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchlist(response.data.map((m: any) => String(m.movieId)));
            } catch (error) {
                console.error("İzleme listesi yüklenirken hata oluştu:", error);
            }
        };
        fetchWatchlist();
    }, [user]);

    useEffect(() => {
        if (posterPreview) {
            const formData = new FormData();
            formData.append("poster", posterPreview);
            fetch("http://localhost:8000/api/poster-search", {
                method: "POST",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setPosterRecommendations(data);
                        setFirstPosterRecommendation(data[0]);
                    } else {
                        setFirstPosterRecommendation(null);
                    }
                })
                .catch(error => console.error(error));
        }
    }, [posterPreview]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;
            const userId = (user as any)._id || "";
            try {
                const response = await axios.get(`http://localhost:5001/api/recommendations?userId=${userId}`);
                const recs: Recommendation[] = Object.entries(response.data).map(
                    ([movie_id, details]) => ({
                        movie_id,
                        predicted_rating: Number((details as any).predicted_rating),
                        title: (details as any).title,
                        poster_path: (details as any).poster_path,
                        overview: (details as any).overview,
                        poster_url:(details as any).poster_url,
                    })
                );
                setRecommendations(recs);
            } catch (error) {
                console.error("Öneriler alınırken hata:", error);
            }
        };
        fetchRecommendations();
    }, [user]);

    const handleSearch = async () => {
        if (!searchTerm) return;
        router.push(`/?query=${encodeURIComponent(searchTerm)}`);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${searchTerm}`
            );
            setMovies(response.data.results);
        } catch (error) {
            console.error("Arama sırasında hata oluştu:", error);
        }
    };

    // Search query param effect is now handled by SearchQueryHandler

    const handleWatchlist = async (movie: Movie) => {
        if (!user) {
            alert("Filmi izleme listesine eklemek için giriş yapmalısınız!");
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
                { movieId: String(movie.id), title: movie.title, poster_path: movie.poster_path },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWatchlist(response.data.watchlist.map((m: any) => String(m.movieId)));
        } catch (error: any) {
            console.error("İzleme listesi hatası:", error);
            alert(error.response?.data?.message || "Bir hata oluştu.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6" data-aos="fade">
            <div className="relative h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/assets/hero-bg.mp4" type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
              <div className="absolute inset-0 bg-pink-200/30 flex flex-col items-start z-10 text-left px-12">
                  <div className="mt-6">
                    <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-lg font-serif">
                         Cinephoria
                    </h1>
                     <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl font-medium">
                         Sinemanın büyüsünü keşfet, tarzına uygun filmleri AI ile bul. Posterle ara, detayları gör, kendi dünyanı oluştur.
                     </p>
                    <p className="mt-2 text-sm text-white/70 italic">Hayal gücünün ötesine geçmeye hazır mısın?</p></div>
              </div>
            </div>

            {/* Suspense ile search param query handler */}
            <Suspense fallback={null}>
              <SearchQueryHandler onQuery={(q) => {
                setSearchTerm(q);
                // Arama sonuçlarını da güncelle (önceki useEffect'in işlevi)
                axios.get(
                  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${q}`
                )
                .then((response) => setMovies(response.data.results))
                .catch((error) => console.error("Arama hatası:", error));
              }} />
            </Suspense>

            {/* Arama Kutusu */}
            <div className="flex justify-center mb-6 gap-2">
                <input
                    type="text"
                    placeholder="Film Ara..."
                    className="input input-bordered w-full max-w rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} className="btn btn-primary text-white rounded-full w-20">Ara</button>
                <div>
                  <button
                    onClick={() => {
                      if (!user) {
                        alert("Lütfen önce giriş yapınız. Bu özellik yalnızca üyelere açıktır.");
                        return;
                      }
                      setShowPosterUpload(true);
                    }}
                    className="btn btn-outline btn-primary text-pink-400 rounded-full w-40"
                  >
                    Poster ile Ara
                  </button>

                  {showPosterUpload && (
                    <div className="fixed z-50 inset-0 flex justify-center pt-[78vh] h-fit">
                      <div className="bg-base-100 p-6 rounded-xl shadow-xl max-w-md w-full relative">
                        <button
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                          onClick={() => setShowPosterUpload(false)}
                        >
                          ×
                        </button>
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg hover:bg-base-200 transition duration-300">
                          <span className="mb-2 px-4 py-2 bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 text-white rounded-md shadow-md hover:scale-105 transform transition-transform duration-300">
                            🎞️ Poster Seç veya Buraya Sürükle
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPosterPreview(reader.result as string);
                                  const formData = new FormData();
                                  formData.append("poster", file);
                                  fetch("http://localhost:8000/api/poster-search", {
                                    method: "POST",
                                    body: formData,
                                  })
                                    .then(res => res.json())
                                    .then(data => {
                                      console.log("🎯 Benzer poster sonuçları:", data);
                                      setPosterRecommendations(data);
                                      setFirstPosterRecommendation(data[0]);
                                    })
                                    .catch(err => {
                                      console.error("❌ Poster karşılaştırma hatası:", err);
                                    });
                                };
                                reader.readAsDataURL(file);
                                console.log("Poster yüklendi:", file);
                              }
                            }}
                          />
                        </label>
                        {posterPreview && (
                          <div className="mt-4">
                            <p className="font-semibold mb-2">Önizleme:</p>
                            <img src={posterPreview} alt="Poster Önizleme" className="max-w-full h-48 object-contain rounded-lg shadow" />
                          </div>
                        )}
                        {firstPosterRecommendation && (
                          <div className="mt-4">
                            <p className="font-semibold mb-2">En Benzer Film:</p>
                            <Image
                              src={firstPosterRecommendation?.poster_url || ""}
                              alt={firstPosterRecommendation.title}
                              width={200}
                              height={300}
                              className="rounded shadow-md mx-auto"
                            />
                            <p className="mt-2 text-base font-medium text-primary">{firstPosterRecommendation.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {posterRecommendations.length > 0 && (
                <div className="mb-8 relative z-20" data-aos="fade-up">
                    <h2 className="text-2xl font-bold mb-4 text-base-content">🎞️ Görsel Benzerliğine Göre Önerilenler</h2>
                    <div
                        ref={recommendationScrollRef}
                        className="relative z-20 flex overflow-x-auto gap-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => {
                            const slider = recommendationScrollRef.current;
                            if (!slider) return;
                            slider.style.scrollBehavior = "auto";
                            slider.dataset.isDown = "true";
                            slider.dataset.startX = String(e.pageX - slider.offsetLeft);
                            slider.dataset.scrollLeft = String(slider.scrollLeft);
                        }}
                        onMouseLeave={() => {
                            const slider = recommendationScrollRef.current;
                            if (!slider) return;
                            slider.dataset.isDown = "false";
                        }}
                        onMouseUp={() => {
                            const slider = recommendationScrollRef.current;
                            if (!slider) return;
                            slider.dataset.isDown = "false";
                            slider.style.scrollBehavior = "smooth";
                        }}
                        onMouseMove={(e) => {
                            const slider = recommendationScrollRef.current;
                            if (!slider || slider.dataset.isDown !== "true") return;
                            e.preventDefault();
                            const x = e.pageX - slider.offsetLeft;
                            const walk = (x - Number(slider.dataset.startX || "0")) * 1.5;
                            slider.scrollLeft = Number(slider.dataset.scrollLeft || "0") - walk;
                        }}
                    >
                        {posterRecommendations.map((rec) => (
                            <div
                                key={rec.movie_id}
                                className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] min-w-[250px]"
                            >
                                <Image
                                    src={rec.poster_url || ""}
                                    alt={rec.title}
                                    width={500}
                                    height={750}
                                    className="object-cover w-full h-[450px] group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                    priority
                                    draggable={false}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h2 className="text-lg font-semibold mb-2 truncate">{rec.title}</h2>
                                    <p className="text-sm mb-2">Tahmini Puan: {rec.predicted_rating}</p>
                                    <Link
                                        href={`/movies/${rec.movie_id || rec.movie_id}`}
                                        className="btn btn-outline btn-primary btn-sm w-full"
                                    >
                                        Detayları Gör
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Önerilen Filmler */}
            {user && recommendations.length > 0 && (
                <div className="mb-8 relative z-20" data-aos="fade-up">
                    <h2 className="text-2xl font-bold mb-4 text-base-content">Üyelerimizin Beğendikleri</h2>
                    <div
                      ref={recommendationScrollRef}
                      className="relative z-20 flex overflow-x-auto gap-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => {
                        const slider = recommendationScrollRef.current;
                        if (!slider) return;
                        slider.style.scrollBehavior = "auto";
                        slider.dataset.isDown = "true";
                        slider.dataset.startX = String(e.pageX - slider.offsetLeft);
                        slider.dataset.scrollLeft = String(slider.scrollLeft);
                      }}
                      onMouseLeave={() => {
                        const slider = recommendationScrollRef.current;
                        if (!slider) return;
                        slider.dataset.isDown = "false";
                      }}
                      onMouseUp={() => {
                        const slider = recommendationScrollRef.current;
                        if (!slider) return;
                        slider.dataset.isDown = "false";
                        slider.style.scrollBehavior = "smooth";
                      }}
                      onMouseMove={(e) => {
                        const slider = recommendationScrollRef.current;
                        if (!slider || slider.dataset.isDown !== "true") return;
                        e.preventDefault();
                        const x = e.pageX - slider.offsetLeft;
                        const walk = (x - Number(slider.dataset.startX || "0")) * 1.5;
                        slider.scrollLeft = Number(slider.dataset.scrollLeft || "0") - walk;
                      }}
                    >
                        {recommendations.map((rec) => (
                            <div
                              key={rec.movie_id}
                              className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] min-w-[250px]"
                            >
                              <Image
                                src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                                alt={rec.title}
                                width={500}
                                height={750}
                                className="object-cover w-full h-[450px] group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                priority
                                draggable={false}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h2 className="text-lg font-semibold mb-2 truncate">{rec.title}</h2>
                                <p className="text-sm mb-2">Tahmini Puan: {rec.predicted_rating}</p>
                                <Link
                                  href={`/movies/${rec.movie_id}`}
                                  className="btn btn-outline btn-primary btn-sm w-full"
                                >
                                  Detayları Gör
                                </Link>
                              </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* Popüler Filmler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                width={500}
                                height={750}
                                className="object-cover w-full h-[450px] group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h2 className="text-lg font-semibold mb-2 truncate">{movie.title}</h2>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleWatchlist(movie)}
                                        className={`btn btn-sm w-full ${watchlist.includes(String(movie.id)) ? "btn-secondary text-white" : "btn-primary text-white"}`}
                                    >
                                        {watchlist.includes(String(movie.id)) ? "İzleme Listesinden Çıkar" : "İzleme Listesine Kaydet"}
                                    </button>
                                    <Link href={`/movies/${movie.id}`} className="btn btn-outline btn-primary btn-sm w-full">
                                        Detayları Gör
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-4">Film bulunamadı.</p>
                )}
            </div>

            <footer className="mt-16 p-8 text-center bg-base-200 rounded-xl shadow-inner">
                <p className="text-2xl font-bold text-primary mb-2">🎬 Pholix</p>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Film zevkini keşfet, paylaş ve geliştir. AI destekli önerilerle sinema dünyasında yeni ufuklar keşfet!
                </p>
                <div className="flex justify-center gap-6 mt-4 text-xl">
                    <a href="#" className="hover:text-primary transition-colors duration-300">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="hover:text-primary transition-colors duration-300">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="hover:text-primary transition-colors duration-300">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </footer>
        </div>
    );
}
