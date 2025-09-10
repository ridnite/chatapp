'use client';
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import React from "react";
import { useParams } from 'next/navigation';

const page = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");
    const params = useParams();

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(`/api/messages/${params.id}`);
            const data = await res.json();
            setMessages(data);
        };
        fetchMessages();

        const channel = supabase
            .channel("messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    const newMsg = payload.new;
                    if (
                        (newMsg.sender_id === params.id || newMsg.receiver_id === params.id)
                    ) {
                        setMessages((prev) => [...prev, newMsg]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.id]);

    const sendMessage = async () => {
        await fetch('/api/messages/send', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: params.id, content: message }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    return (
        <div className='w-full h-full py-6 overflow-y-scroll'>
            <div className="flex flex-col gap-2 mb-24 px-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-xl border-1 max-w-[70%] ${msg.sender_id === params.id ? "border-border self-start" : "border-border text-white self-end"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="w-full h-16 fixed bottom-2 left-1/2 translate-x-[-50%] flex items-center justify-between py-4">
                <div className="w-24 h-full lg:w-64 xl:w-78"></div>
                <div className="h-full flex-1 flex items-center justify-center px-4 gap-2">
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="bg-border w-full h-14 rounded-lg px-4 text-xl" />
                    <button onClick={sendMessage} className="bg-border h-14 w-14 px-4 rounded-full text-3xl text-center flex items-center justify-center">+</button>
                </div>
                <div className="w-24 h-full lg:w-64 xl:w-78"></div>
            </div>
        </div>
    )
}

export default page