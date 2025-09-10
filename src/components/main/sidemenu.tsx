'use client'
import React from 'react'
import { IoMdSettings, IoMdPersonAdd } from "react-icons/io";
import { FaPeopleArrows } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { IoHomeSharp } from "react-icons/io5";

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
                <button onClick={() => router.push('/main')} className={`w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer ${pathname === '/main' ? 'bg-border border-l-4 border-foreground' : ''}`}>
                    <IoHomeSharp className='w-6 h-6' />
                    <span className='hidden lg:block'>Ana sayfa</span>
                </button>
                <button onClick={() => router.push('/addfriend')} className={`w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer ${pathname === '/addfriend' ? 'bg-border border-l-4 border-foreground' : ''}`}>
                    <IoMdPersonAdd className='w-6 h-6' />
                    <span className='hidden lg:block'>Yeni Arkadaş Ekle</span>
                </button>
                <button onClick={() => router.push('/friend-request')} className={`w-full h-10 rounded-lg flex items-center justify-start gap-2 p-2 text-sm md:text-base lg:text-lg hover:bg-border transition cursor-pointer ${pathname === '/friend-request' ? 'bg-border border-l-4 border-foreground' : ''}`}>
                    <FaPeopleArrows className='w-6 h-6' />
                    <span className='hidden lg:block'>Arkadaşlık istekleri</span>
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