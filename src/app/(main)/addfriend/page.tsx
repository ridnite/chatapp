'use client'
import React, { useState, useEffect, use } from 'react'
import { IoMdPersonAdd } from "react-icons/io";

const page = () => {
    const [friendName, setFriendName] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [myname, setMyname] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const { username } = JSON.parse(userData);
            setMyname(username);
        }
    }, []);

    useEffect(() => {
        if (friendName) {
            const timer = setTimeout(() => {
                fetch(`/api/users/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: friendName }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setSearchResults(Array.isArray(data.user) ? data.user : []);
                    });
            }, 350);

            return () => clearTimeout(timer);
        }
    }, [friendName]);

    const handleAddFriend = async (friendId: string) => {
        const response = await fetch(`/api/users/friendships`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friendId }),
        });

        const data = await response.json();
        if (response.ok) {
            setSuccessMessage("başarılı:" + data);
        } else {
            setErrorMessage("Hata oluştu:" + data);
        }
    };

    return (
        <div className='w-full h-full py-6 overflow-y-scroll'>
            <div className='w-full max-w-200 h-fit mx-auto flex flex-col gap-4 px-4'>
                <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)} className='w-full h-12 rounded-xl bg-input px-4 text-xl' />
            </div>
            {errorMessage && (
                <div className='w-full max-w-200 h-fit mx-auto flex flex-col gap-4 px-4 mt-4'>
                    <p className='text-red-500'>{errorMessage ? "hata" : ""}</p>
                </div>
            )}
            {successMessage && (
                <div className='w-full max-w-200 h-fit mx-auto flex flex-col gap-4 px-4 mt-4'>
                    <p className='text-green-500'>{successMessage ? "istek gönderildi" : ""}</p>
                </div>
            )}
            {
                searchResults.length > 0 && (
                    <div className='w-full max-w-200 h-fit mx-auto flex flex-col gap-4 px-4 mt-4'>
                        {searchResults.map((user) => (
                            user.name !== myname && (
                                <div key={user.id} className='w-full h-16 bg-card rounded-xl flex items-center gap-4 p-4'>
                                    {
                                        user.image ? (
                                            <img src={user.image} alt={user.name} className='w-10 h-10 rounded-full object-cover' />
                                        ) : (
                                            <div className='w-10 h-10 rounded-full bg-ring flex items-center justify-center'>
                                                <p className='font-bold'>{user.name.charAt(0)}</p>
                                            </div>
                                        )}
                                    <p>{user.name}</p>
                                    <button onClick={() => handleAddFriend(user.id)} className='ml-auto bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-input transition cursor-pointer'>
                                        <IoMdPersonAdd className='w-5 h-5' />
                                        <span className='hidden lg:block'>Ekle</span>
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default page