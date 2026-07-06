"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export function useNotifications(userId: string | number | undefined) {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const pathname = usePathname();

    useEffect(() => {
     
        if (!userId) return;
        const currentUserId = Number(userId);

        const fetchUnreadCount = async () => {
            try {
                
                const res = await fetch("/api/notifications/unread")
                const data = await res.json();
                
                if (!res.ok) {
                    toast.error(data.message || "Something Went Wrong.")
                    return;
                }
                setUnreadCount(data.count || 0);
            } catch (err) {
                console.error("Failed loading notifications count:", err);
            }
        }
        
        fetchUnreadCount();

       
        const socket = io();

        socket.on("connect", () => {
            socket.emit("register-notification-stream", currentUserId);
        });

        socket.on("new-notification-alert", () => {
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (pathname === "/dashboard/notifications") {
            setUnreadCount(0);
        }
    }, [pathname]);

    return { unreadCount, setUnreadCount };
}