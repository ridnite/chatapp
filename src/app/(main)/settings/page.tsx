'use client'
import React, { useState } from 'react'

const page = () => {
    const [newName, setNewName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [newBio, setNewBio] = useState("");
    const [bioError, setBioError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleNameChange = async () => {
        const response = await fetch('/api/settings/newname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName })
        });
        if (response.ok) {
            let user = JSON.parse(localStorage.getItem('user_data') || '{}');
            user.username = newName;
            localStorage.setItem('user_data', JSON.stringify(user));
            window.location.reload();
        } else {
            setNameError("Kullanıcı adı değiştirilemedi");
        }
    }

    const handleBioChange = async () => {
        const response = await fetch('/api/settings/newbio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newBio })
        });
        if (response.ok) {
            let user = JSON.parse(localStorage.getItem('user_data') || '{}');
            user.bio = newBio;
            localStorage.setItem('user_data', JSON.stringify(user));
            window.location.reload();
        } else {
            setBioError("Bio değiştirilemedi");
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setUploadError("Bir dosya seçmelisin");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/settings/avatar", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                let user = JSON.parse(localStorage.getItem("user_data") || "{}");
                user.image = data.url;
                localStorage.setItem("user_data", JSON.stringify(user));
                window.location.reload();
            } else {
                setUploadError(data.error || "Upload başarısız");
            }
        } catch (err) {
            setUploadError("Sunucuya bağlanılamadı");
        }
    };

    return (
        <div className='w-full h-full py-2 overflow-y-scroll'>
            <div className='w-full h-fit p-4 rounded-lg bg-card border-1 border-border flex flex-col gap-4'>
                <p>kullanıcı adını değiştir</p>
                <input type="text" placeholder='Yeni kullanıcı adı' value={newName} onChange={(e) => setNewName(e.target.value)} className='bg-input rounded-lg px-2 w-full max-w-58 h-8' />
                <button className='bg-border rounded-lg px-4 py-2 h-10 w-32 cursor-pointer' onClick={handleNameChange}>güncelle</button>
            </div>
            <div className='w-full h-fit p-4 rounded-lg bg-card border-1 border-border flex flex-col gap-4 mt-2'>
                <p>Profil fotoğrafını değiştir</p>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className='bg-input rounded-lg px-2 w-full max-w-58 h-8' />
                <button className='bg-border rounded-lg px-4 py-2 h-10 w-32 cursor-pointer' onClick={handleUpload}>güncelle</button>
            </div>
            <div className='w-full h-fit p-4 rounded-lg bg-card border-1 border-border flex flex-col gap-4 mt-2'>
                <p>bio'yu değiştir</p>
                <input type="text" placeholder='Yeni bio' value={newBio} onChange={(e) => setNewBio(e.target.value)} className='bg-input rounded-lg px-2 w-full max-w-58 h-8' />
                <button className='bg-border rounded-lg px-4 py-2 h-10 w-32 cursor-pointer' onClick={handleBioChange}>güncelle</button>
            </div>
        </div>
    )
}

export default page