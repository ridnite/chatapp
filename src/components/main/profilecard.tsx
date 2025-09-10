'use client'
import React, { useState, useEffect } from 'react'
import { FaUser } from "react-icons/fa";
import { IoMdSettings, IoMdPersonAdd } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const ProfileCard = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [bio, setBio] = useState<string | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const { username, image, bio } = JSON.parse(userData);
            setUsername(username);
            setImage(image);
            setBio(bio);
        }
    }, []);

    return (
        <div className='w-full h-fit bg-card rounded-lg border-border border-1 p-4 flex flex-col'>
            <div className='w-full h-fit flex items-center gap-2 lg:gap-4'>
                <div className='w-12 h-12 rounded-full flex items-center justify-center bg-ring'>{image ? <img src={image} alt={username || "Kullanıcı Adı"} className='w-full h-full rounded-full' /> : <FaUser className='w-1/2 h-1/2' />}</div>
                <span className='hidden lg:block text-sm md:text-lg lg:text-xl'>{username || "Kullanıcı Adı"}</span>
            </div>
            <div className='w-full h-0.5 bg-border my-4'></div>
            <div className={`w-full h-fit items-center gap-2 lg:gap-4 break-words hidden lg:flex`}>
                <p className='w-full'>{bio || "Henüz biyografini yazmadın"}</p>
            </div>
        </div>
    )
}

export default ProfileCard