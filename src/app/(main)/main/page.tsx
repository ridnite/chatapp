'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('api/users/allfriends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      const data = await res.json();
      setUserData(data);
    });
  }, []);
  return (
    <div className='w-full h-full py-6 overflow-y-scroll'>
      <div className='w-full h-fit grid grid-cols-1 p-2'>
        {userData && userData.length > 0 ? userData.map((user: any) => (
          <div key={user.sender_id} onClick={() => router.push(`/chat/${user.sender_id}`)} className='w-full h-16 bg-card rounded-lg border-border border-1 flex items-center gap-4 p-2 md:p-4'>
            {
              user.sender.image ? (
                <img src={user.sender.image} alt={user.sender.name} className='w-10 h-10 rounded-full object-cover' />
              ) : (
                <div className='w-10 h-10 rounded-full bg-ring flex items-center justify-center'>
                  <p className='font-bold'>{user.sender.name.charAt(0)}</p>
                </div>
              )
            }
            <p className='text-lg text-gray-300'>{user.sender.name}</p>
          </div>
        )) : (
          <div className='w-full h-16 bg-card/50 rounded-lg border-border border-1 flex items-center justify-center p-2'>
            <span className='text-sm text-gray-500'>Hiç arkadaş yok</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default page