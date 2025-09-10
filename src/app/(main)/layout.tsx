'use client';
import React from 'react';
import LeftBar from '@/components/main/leftbar';
import ProfileCard from '@/components/main/profilecard';
import Sidemenu from '@/components/main/sidemenu';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-screen h-screen flex items-center bg-accent">
            <aside className="flex w-24 h-full lg:w-64 xl:w-78 items-center justify-center p-2">
                <LeftBar />
            </aside>
            <main className="flex-1 h-full flex items-center justify-center">
                {children}
            </main>
            <aside className="block w-24 h-full lg:w-64 xl:w-78 p-2 overflow-y-scroll">
                <ProfileCard />
                <Sidemenu />
            </aside>
        </div>
    );
}