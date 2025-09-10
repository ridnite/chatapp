'use client'
import React, { useState, useEffect } from 'react'

const page = () => {
    const [friendRequests, setFriendRequests] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const response = await fetch('/api/users/friendreq');
            const data = await response.json();
            setFriendRequests(data);
        };
        fetchFriendRequests();
    }, []);

    const handleAccept = async (senderId: string) => {
        const response = await fetch('/api/users/accept', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender_id: senderId }),
        });
        const data = await response.json();
        if (response.ok) {
            setFriendRequests((prev) => prev.filter((req) => req.sender_id !== senderId));
        } else {
            setErrorMessage(data.error);
        }
    };

    const handleReject = async (senderId: string) => {
        const response = await fetch('/api/users/reject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender_id: senderId }),
        });
        const data = await response.json();
        if (response.ok) {
            setFriendRequests((prev) => prev.filter((req) => req.sender_id !== senderId));
        } else {
            setErrorMessage(data.error);
        }
    };

    return (
        <div className='w-full h-full py-6 overflow-y-scroll'>
            {
                friendRequests.length > 0 ? (
                    friendRequests.map((request) => (
                        <div className='w-full h-16 bg-card rounded-xl flex items-center gap-4 p-4' key={request.sender_id}>
                            {
                                request.sender.image ? (
                                    <img src={request.sender.image} alt={request.sender.name} className='w-10 h-10 rounded-full object-cover' />
                                ) : (
                                    <div className='w-10 h-10 rounded-full bg-ring flex items-center justify-center'>
                                        <p className='font-bold'>{request.sender.name.charAt(0)}</p>
                                    </div>
                                )
                            }
                            <p>{request.sender.name}</p>
                            <div className='ml-auto flex gap-2'>
                                <button className='bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer' onClick={() => handleAccept(request.sender_id)}>Kabul Et</button>
                                <button className='bg-red-600 text-white px-4 py-2 rounded-xl cursor-pointer' onClick={() => handleReject(request.sender_id)}>Reddet</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-gray-500 mt-4'>Hiç arkadaşlık isteği yok</p>
                )
            }
        </div>
    )
}

export default page