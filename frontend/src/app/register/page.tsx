'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                username,
                email,
                password,
            });
            console.log("Backend Yanıtı:", response.data);
            setMessage(response.data.message);
        } catch (error: any) {
            console.error("Hata:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Bir hata oluştu.");
        }
    };

    return (
        <>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
            >
                <source src="/assets/register-bg.mp4" type="video/mp4"/>
                Tarayıcınız video etiketini desteklemiyor.
            </video>
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10 z-10"/>
            <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden z-20">
                <div className="card w-96 bg-base-100 shadow-xl animate-fade-in">
                    <div className="card-body">
                        <h2 className="text-3xl font-bold text-center text-primary">Kayıt Ol</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="👤 Kullanıcı Adı"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/>
                            <input
                                type="email"
                                placeholder="📧 E-posta"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                            <input
                                type="password"
                                placeholder="🔒 Şifre"
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit"
                                    className="btn w-full bg-primary text-white hover:bg-primary-focus transition-all duration-300">
                                Kayıt Ol
                            </button>
                        </form>
                        {message && <p className="mt-4 text-success">{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}