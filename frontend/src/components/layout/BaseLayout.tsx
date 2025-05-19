'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // useAuth eklendi
import { useRouter } from "next/navigation"; // useRouter eklendi
import { useState } from "react";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth(); // Kullanıcı bilgilerini çek
    const router = useRouter(); // Sayfa yönlendirme için router
    const [theme, setTheme] = useState("light");

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = e.target.value;
        setTheme(selectedTheme);
        document.documentElement.setAttribute("data-theme", selectedTheme);
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            {/* Navbar */}
            <nav className="bg-base-100 shadow-md sticky top-0 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo with optional icon */}
                    <h1 className="text-2xl font-extrabold tracking-tight hover:text-primary transition duration-300">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="logo" width={28} height={28} />
                            <span className="hidden sm:inline-block">CINEPHORIA</span>
                        </Link>
                    </h1>

                    {/* Menü & Kullanıcı */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="btn btn-outline btn-sm border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    Profilim
                                </Link>
                                <button
                                    onClick={() => { logout(); router.push("/login"); }}
                                    className="btn btn-primary text-white btn-sm rounded-full"
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="btn btn-outline btn-sm border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    Kayıt Ol
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn btn-outline btn-sm border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    Giriş Yap
                                </Link>
                            </>
                        )}

                        <Link
                            href="/about"
                            className="font-bender btn btn-sm rounded-full text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse shadow-lg hover:scale-105 transition-transform duration-300"
                        >
                            Proje Bilgisi
                        </Link>

                        {/* Tema Toggle */}
                        <select
                            className="select select-bordered select-sm rounded-full"
                            value={theme}
                            onChange={handleThemeChange}
                        >
                            <option value="light">🌞 Açık</option>
                            <option value="dark">🌙 Karanlık</option>
                        </select>
                    </div>
                </div>
            </nav>

            {/* Sayfa İçeriği */}
            <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-base-300 text-base-content">
                <div className="container mx-auto px-4 py-4 text-center">
                    <p>© 2025 MovieReviewAI. Tüm Hakları Saklıdır.</p>
                </div>
            </footer>
        </div>
    );
}