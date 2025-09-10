'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const LeftBar = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/messages/recent');
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                console.error('Recent fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    if (loading) {
        return <div className="p-4">Yükleniyor...</div>;
    }

    return (
        <div className='w-full h-full block gap-4 lg:p-4 bg-card rounded-lg border-border border-1 overflow-y-scroll chat-container'>
            <h2 className="text:sm text-center lg:text-lg font-semibold mb-2">Son Mesajlar</h2>
            {conversations.length === 0 ? (
                <div className="p-4 text-muted-foreground">Henüz mesaj yok</div>
            ) : (
                conversations.map((conv: any) => (
                    <div
                        key={conv.sender_id}
                        onClick={() => router.push(`/chat/${conv.sender_id}`)}
                        className={`flex items-center gap-3 lgp-3 hover:bg-accent cursor-pointer p-2 rounded-lg ${pathname === `/chat/${conv.sender_id}` ? 'bg-accent border-l-4 border-foreground' : ''}`}
                    >
                        {
                            conv.sender.image ? (
                                <img src={conv.sender.image} alt={conv.sender.name} className='w-10 h-10 rounded-full object-cover mx-auto' />
                            ) : (
                                <div className='w-10 h-10 rounded-full bg-ring flex items-center justify-center'>
                                    <p className='font-bold'>{conv.sender.name.charAt(0)}</p>
                                </div>
                            )
                        }
                        <div className="hidden lg:block flex-1 overflow-hidden">
                            <p className="font-semibold truncate">{conv.sender?.name || 'Bilinmeyen'}</p>
                            <p className="text-sm text-muted-foreground truncate">
                                {conv.lastMessage}
                            </p>
                        </div>
                        <p className="hidden lg:block text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(conv.lastAt).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                ))
            )}
        </div>
    )
}

export default LeftBar