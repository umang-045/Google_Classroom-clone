"use client"
import React, { useEffect, useState } from "react";
import { Bell, BookOpen, MessageSquare, Award, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

interface NotificationItem {
  id: number;
  title: string;
  messgae: string; 
  type: "ASSIGNMENT" | "ANNOUNCEMENT" | "GRADE" | "QUIZ";
  isRead: boolean;
  created_at: string;
  classroom?: { className: string } | null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getIcon = (type: string) => {
    switch (type) {
      case "ASSIGNMENT": return <BookOpen className="text-blue-500 size-5" />;
      case "ANNOUNCEMENT": return <MessageSquare className="text-green-500 size-5" />;
      case "GRADE": return <Award className="text-amber-500 size-5" />;
      case "QUIZ": return <HelpCircle className="text-purple-500 size-5" />;
      default: return <Bell className="text-zinc-500 size-5" />;
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
    
        const res = await fetch("/api/notifications");
        const data = await res.json();
        
        if (res.ok) {
          setNotifications(data.notifications || []);
       
          const unreadExists = data.notifications?.some((n: NotificationItem) => !n.isRead);
          if (unreadExists) {
            await fetch("/api/notifications", { method: "PUT" });
          }
        } else {
          toast.error(data.message || "Failed to load notifications.");
        }
      } catch (err) {
        console.error("Client fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Bell className="size-6 text-zinc-400" />
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
                notif.isRead 
                  ? "bg-zinc-900/40 border-zinc-800/60 opacity-70" 
                  : "bg-zinc-900 border-blue-500/30 shadow-sm shadow-blue-500/5"
              }`}
            >
              <div className="p-2 bg-zinc-800/50 rounded-lg h-fit shrink-0">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-zinc-100 text-sm md:text-base truncate">
                    {notif.title}
                  </h3>
                  <span className="text-xs text-zinc-500 whitespace-nowrap pt-0.5">
                    {new Date(notif.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-400 break-words line-clamp-2">
                  {notif.messgae}
                </p>

                {notif.classroom?.className && (
                  <div className="inline-block mt-1">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                      {notif.classroom.className}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}