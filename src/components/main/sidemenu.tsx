'use client'
import React from 'react'
import { IoMdSettings, IoMdPersonAdd } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Sidemenu = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user_data');
        fetch('/api/auth/logout', {
            method: 'POST',
        }).then(() => {
            router.push('/');
        });
    }

    return (
        <div className='w-full h-fit mt-4 bg-card rounded-lg border-border border-1 p-4 flex flex-col'>
            <div className='w-full h-fit flex flex-col gap-2'>
                <button onClick={() => router.push('/addfriend')} className={`w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer ${pathname === '/addfriend' ? 'bg-border border-l-4 border-foreground' : ''}`}>
                    <IoMdPersonAdd className='w-6 h-6' />
                    <span className='hidden lg:block'>Yeni Arkadaş Ekle</span>
                </button>
                <button className='w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer'>
                    <IoMdSettings className='w-6 h-6' />
                    <span className='hidden lg:block'>Ayarlar</span>
                </button>
                <button onClick={handleLogout} className='w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer'>
                    <MdLogout className='w-6 h-6 text-chart-5' />
                    <span className='hidden lg:block'>Çıkış Yap</span>
                </button>
            </div>
        </div>
    )
}

export default Sidemenu