"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5001/api/auth/login", {
                email,
                password,
            });

            login(response.data.token, response.data.user);
            setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");

            setTimeout(() => {
                router.push("/profile");
            }, 1000);
        } catch (error: any) {
            console.error("Hata:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Giriş sırasında bir hata oluştu.");
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
            >
                <source src="/assets/register-bg.mp4" type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
            </video>

            <div className="fixed w-screen h-screen z-10 pointer-events-none" />

            <div className="card w-96 bg-base-100 shadow-xl animate-fade-in">
                <div className="card-body">
                    <h2 className="text-3xl text-primary font-bold text-center mb-6">Giriş Yap</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="📧 E-posta"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="🔒 Şifre"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary w-full text-white">
                            Giriş Yap
                        </button>
                    </form>
                    {message && <p className="mt-4 text-center text-success">{message}</p>}
                </div>
            </div>
        </div>
    );
}