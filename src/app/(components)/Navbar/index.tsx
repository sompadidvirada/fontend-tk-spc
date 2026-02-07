"use client";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, MessageSquare } from "lucide-react";
import LanguageSwicth from "./component/LanguageSwicth";
import { useEffect, useState, useRef } from "react";
import {
  checkNotification,
  getDetailReport,
  markAsRead,
} from "@/app/api/client/track_report_baristar";
import { JWTPayload } from "jose";
import { useSocket } from "@/socket-io/SocketContext";
import { useStaffStore } from "@/store/staff";



const Navbar = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const staff = useStaffStore((s)=>s.staff)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const socket = useSocket();



  const fetchNotification = async () => {
    const id = staff?.id;
    if (!id) return;
    try {
      const ress = await checkNotification({ staffId: Number(id) });
      // Axios stores the data in .data
      setNotifications(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotificationClick = async (reportId: number) => {
    const staffId = Number(staff?.id)

    try {
      // Mark as read in background
      await markAsRead({ staffId, reportId });

      // Fetch full details
      const response = await getDetailReport(reportId);
      setSelectedReport(response.data);
      setIsModalOpen(true); // Open the detail modal

      // Remove from notification list
      setNotifications((prev) => prev.filter((item) => item.id !== reportId));
      setIsOpen(false); // Close the notification dropdown
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, [staff]);

  useEffect(() => {
    if (!socket) return;
    // Listen for the event from the backend
    socket.on("new_report_notification", (newReport) => {
      // Check if report is already in the list to avoid duplicates

      console.log(newReport)
      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === newReport.id);
        if (exists) return prev;
        return [newReport, ...prev]; // Add new report to the top
      });

      // Optional: Play a notification sound
      // new Audio('/notification-sound.mp3').play();
    });

    return () => {
      socket.off("new_report_notification");
    };
  }, [socket]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full pr-2 md:pr-5 bg-secondary border-b">
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
      </header>

      <div className="flex justify-between items-center gap-1 md:gap-2 ">
        <LanguageSwicth />
        <ThemeSwitcher />

        {/* NOTIFICATION SECTION */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-2 rounded-full hover:bg-secondary transition-colors relative"
            aria-label="notification list"
          >
            <Bell
              className={`w-5 h-5 ${notifications.length > 0 ? "text-blue-500" : "text-gray-500"}`}
            />

            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* POPUP CARD */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border rounded-lg shadow-xl z-50 overflow-hidden font-lao">
              <div className="p-3 border-b bg-muted/50 font-semibold flex justify-between items-center">
                <span>Notifications</span>
                <span className="text-xs text-muted-foreground">
                  {notifications.length} unread
                </span>
              </div>

              <div className="max-height-[400px] overflow-y-auto max-h-[70vh]">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      onClick={() => handleNotificationClick(item.id)}
                      key={item.id}
                      className="p-4 border-b hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.descriptoion}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2">
                            {new Date(item.report_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No new notifications
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <button className="w-full py-2 text-xs text-center text-blue-500 bg-muted/20 hover:bg-muted/50 font-medium">
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-lao">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <h2 className="text-lg font-bold">{selectedReport.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>ແຈ້ງຈາກສາຂາ: {selectedReport.branch?.name || "N/A"}</span>
                <span>
                  ວັດທີ: {new Date(selectedReport.report_date).toLocaleString()}
                </span>
              </div>

              <p className="text-foreground leading-relaxed mb-6">
                {selectedReport.descriptoion}
              </p>

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-2">
                {selectedReport.baristar_images_report?.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt="report"
                    className="rounded-lg w-full h-48 object-cover border hover:scale-[1.02] transition-transform"
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
