"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function EditProfile() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user || !avatarFile) {
            alert("Lütfen bir dosya seçin!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Yetkilendirme hatası! Lütfen giriş yapın.");
                return;
            }

            const formData = new FormData();
            formData.append("avatar", avatarFile);

            const uploadResponse = await axios.post("http://localhost:5001/api/users/upload-avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            const updatedUser = { ...user, avatarUrl: uploadResponse.data.avatarUrl };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            router.push("/profile");
        } catch (error) {
            console.error("🚨 Profil fotoğrafı yüklenirken hata oluştu:", error);
            alert("Profil fotoğrafı yüklenirken hata oluştu!");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Profili Düzenle</h1>

            <div className="flex flex-col items-center">
                {/* Profil Fotoğrafı Önizleme */}
                <div className="avatar">
                    <div className="w-24 rounded-full border-2 border-gray-300">
                        <img src={previewUrl || "/owl.png"} alt="Profil Fotoğrafı" />
                    </div>
                </div>

                {/* Profil Fotoğrafı Yükleme */}
                <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs mt-4"
                    onChange={handleFileChange}
                />

                {/* Kaydet Butonu */}
                <button onClick={handleSave} className="btn btn-primary text-white mt-4">
                    Kaydet
                </button>
            </div>
        </div>
    );
}
