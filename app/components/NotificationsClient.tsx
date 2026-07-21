"use client";
import React, { useState } from "react";
import { Bell, BookOpen, MessageSquare, Award, HelpCircle, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NotificationItem {
  id: number;
  title: string;
  message: string; 
  type: "ASSIGNMENT" | "ANNOUNCEMENT" | "GRADE" | "QUIZ";
  isRead: boolean;
  created_at: string;
  classroom?: { className: string } | null;
}

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
}

export default function NotificationsPage({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [clearing, setClearing] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "ASSIGNMENT": return <BookOpen className="text-blue-500 size-5" />;
      case "ANNOUNCEMENT": return <MessageSquare className="text-green-500 size-5" />;
      case "GRADE": return <Award className="text-amber-500 size-5" />;
      case "QUIZ": return <HelpCircle className="text-purple-500 size-5" />;
      default: return <Bell className="text-zinc-500 size-5" />;
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0 || clearing) return;
    setClearing(true);
    try {
      const res = await fetch("/api/notifications/clearall", {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setNotifications([]);
        toast.success("Notifications cleared successfully");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to the server.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white pb-10">
      <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-zinc-400 hover:text-white hover:bg-zinc-800" />

          <Separator orientation="vertical" className="h-4 w-[1px] bg-zinc-800 self-center" />
          <Bell className="size-5 text-zinc-400 ml-1" />
          <h1 className="text-xl font-bold tracking-tight leading-none">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/20 text-zinc-400 hover:text-red-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {clearing ? (
              <Loader2 className="size-3.5 animate-spin text-red-400" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            Clear All
          </button>
        )}
      </div>


      <div className="flex-1 w-full">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-32 text-center text-zinc-500">
            <Bell className="size-12 text-zinc-700 mb-3 animate-pulse" />
            <p className="text-base font-medium">No notifications yet.</p>
          </div>
        ) : (
          <div className="w-full divide-y divide-zinc-900">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex gap-5 p-6 w-full transition-all duration-150 group ${notif.isRead
                  ? "bg-zinc-950/20 opacity-60 hover:opacity-100 hover:bg-zinc-900/40"
                  : "bg-zinc-900/20 border-l-2 border-l-blue-500 hover:bg-zinc-900/60"
                  }`}
              >
                <div className="p-2.5 bg-zinc-900 rounded-lg h-fit shrink-0 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-6">
                    <h2 className="font-semibold text-zinc-200 text-sm md:text-base group-hover:text-white transition-colors">
                      {notif.title}
                    </h2>
                    <span className="text-xs text-zinc-500 whitespace-nowrap pt-0.5 group-hover:text-zinc-400 transition-colors">
                      {new Date(notif.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 break-words leading-relaxed max-w-6xl group-hover:text-zinc-300 transition-colors">
                    {notif.message}
                  </p>

                  {notif.classroom?.className && (
                    <div className="inline-block pt-0.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 uppercase tracking-wider border border-zinc-800 group-hover:border-zinc-700 group-hover:text-zinc-300 transition-colors">
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
    </div>
  );
}