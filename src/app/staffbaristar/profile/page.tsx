"use client";

import React, { useState, useTransition } from "react";
import {
  Package,
  Ban,
  Calendar as CalendarIcon,
  MapPin,
  LogOut,
  Settings,
  Loader2,
  User,
  Camera,
  ClipboardClock,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSession } from "../SessionProvider";
import { addDays, format, getDay } from "date-fns";
import { getSendAndExp } from "@/app/api/client/baristar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logoutAction } from "@/app/(auth)/logout/action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useStaffStore } from "@/store/staff";
import { updateStaffProfile } from "@/app/(login)/login/action";

interface ReportData {
  send: {
    quantity: number;
    amount: number;
  };
  expired: {
    quantity: number;
    amount: number;
  };
  loss_rate_percent: number;
}

const ProfilePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const staff_detail = useStaffStore((s)=>s.staff)
  const setStaff = useStaffStore((s)=>s.setStaff)
  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const [reportSendExp, setReprotSendExp] = useState<ReportData>();
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editName, setEditName] = useState(staff_detail?.name || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    staff_detail?.image || null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      alert("ກະລຸນາປ້ອນຊື່");
      return;
    }
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // 3. Call the Server Action
      const result = await updateStaffProfile(
        formData,
        Number(staff_detail.id),
      );
      const ress = result.user
      setStaff(ress)

      if (result.message === "Update success") {
        setIsDialogOpen(false); 
        setSelectedImage(null); 
        window.location.reload();
      } else {
        toast.error("ມິຂໍ້ຜິດພາດໃນການແກ້ໄຂ.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("ເຊີເວີຂັດຂ້ອງ");
    } finally {
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const fecthSendExp = async () => {
      startTransition(async () => {
        try {
          const ress = await getSendAndExp({
            branchId: Number(staff_detail.branchId),
            date: dateString,
          });
          setReprotSendExp(ress.data.data);
        } catch (err) {
          console.log(err);
        }
      });
    };

    if (date && staff_detail?.branchId) {
      fecthSendExp();
    }
  }, [date]);
  const stats = {
    qtySend: 450,
    amtSend: 12500000,
    qtyExp: 42,
    amtExp: 1450000,
    percent: "19.3",
  };

  // 2. Use a consistent formatter
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US").format(val) + " ₭";

  // 3. Return a skeleton or null until mounted to avoid the mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-lao">
      {/* 1. LARGE PROFILE SECTION (Takes ~40% of screen) */}
      <div className="relative bg-[#402f22] pt-12 pb-8 px-6 rounded-b-[40px] shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage
                src={
                  staff_detail
                    ? staff_detail.image
                    : "https://github.com/shadcn.png"
                }
                className="object-cover object-center"
              />
              <AvatarFallback>TK</AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center text-white space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {staff_detail ? staff_detail.name : "-"}
            </h1>
            <div className="flex items-center justify-center gap-1 text-gray-100 text-sm">
              <MapPin size={14} />
              <span>{staff_detail ? staff_detail.branch_name : "-"}</span>
            </div>
          </div>

          {/* Date Selector integrated into the dark header */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-6"
              >
                {isPending ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <CalendarIcon size={16} className="mr-2 text-blue-400" />
                )}
                {date.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-white" align="center">
              <div className="grid grid-cols-3 gap-1">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m, i) => (
                  <Button
                    key={m}
                    variant={date.getMonth() === i ? "default" : "ghost"}
                    className="h-10 text-xs"
                    onClick={() => {
                      const d = new Date(date);
                      d.setMonth(i);
                      setDate(d);
                    }}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 2. STATS SECTION (Two Columns) */}
      <div className="px-6 -mt-6">
        {" "}
        {/* Negative margin to overlap the header slightly */}
        <div className="grid grid-cols-2 gap-4">
          {/* Send Column */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center text-center">
              {isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center" />
              )}
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
                <Package size={24} />
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                ຍອດຮັບເຂົ້າໃນເດືອນ
              </p>
              <p className="text-xl font-black mt-1">
                {reportSendExp
                  ? reportSendExp?.send?.quantity.toLocaleString()
                  : "0"}
              </p>
              <p className="text-[11px] font-semibold text-blue-600 mt-1">
                {reportSendExp
                  ? formatCurrency(reportSendExp.send.amount)
                  : "-"}
              </p>
            </CardContent>
          </Card>

          {/* Expire Column */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center text-center">
              {isPending && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center" />
              )}
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl mb-2">
                <Ban size={24} />
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                ຍອດໝົດອາຍຸໃນເດືອນ
              </p>
              <p className="text-xl font-black mt-1">
                {reportSendExp
                  ? reportSendExp.expired.quantity.toLocaleString()
                  : 0}
              </p>
              <p className="text-[11px] font-semibold text-orange-600 mt-1">
                {reportSendExp
                  ? formatCurrency(reportSendExp.expired.amount)
                  : "-"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. ADDITIONAL DETAILS */}
      <div className="p-6 space-y-4">
        {/* Simple Progress Bar for Loss Rate */}
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-700 uppercase">
              ເປີເຊັນໝົດອາຍຸໃນເດືອນ
            </span>
            <span
              className={cn(
                "text-lg font-black",
                Number(reportSendExp ? reportSendExp.loss_rate_percent : 0) > 10
                  ? "text-red-600"
                  : "text-green-600",
              )}
            >
              {reportSendExp ? reportSendExp.loss_rate_percent : 0}%
            </span>
          </div>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full",
                Number(stats.percent) > 10 ? "bg-red-500" : "bg-green-500",
              )}
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-14 rounded-2xl bg-slate-50 px-4 active:scale-95 transition-transform"
            onClick={() => router.push("/staffbaristar/profile/reporthistory")}
          >
            <div className="flex items-center gap-3">
              <ClipboardClock size={20} className="text-slate-400" />
              <span className="text-sm font-medium">
                ເບີ່ງປະຫວັດການລາຍງານເບເກີລີ້
              </span>
            </div>
            {/* Optional: Add a chevron icon for better UI */}
            <ChevronRight size={18} className="text-slate-300" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpen(true)}
                className="w-full justify-between h-14 rounded-2xl bg-slate-50 px-4"
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-slate-400" />
                  <span className="text-sm font-medium">ແກ້ໄຂຂໍ້ມູນສ່ວນໂຕ</span>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-[30px] w-[92%] font-lao" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  ແກ້ໄຂຂໍ້ມູນສ່ວນໂຕ
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* IMAGE UPLOAD SECTION */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-md">
                      <AvatarImage
                        src={previewUrl || ""}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        <User size={40} />
                      </AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera size={16} />
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    ກົດທີ່ໄອຄອນເພື່ອປ່ຽນຮູບ
                  </p>
                </div>

                {/* NAME INPUT SECTION */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-600"
                  >
                    ຊື່ພະນັກງານ
                  </Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                    placeholder="ປ້ອນຊື່ຂອງທ່ານ"
                  />
                </div>
              </div>

              <DialogFooter className="flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-none bg-slate-100"
                  onClick={() => setIsDialogOpen(false)}
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isEditing}
                  onClick={handleUpdateProfile}
                >
                  {isEditing ? <Loader2 className="animate-spin" /> : "ບັນທຶກ"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-14 rounded-2xl bg-red-50/50 text-red-600 hover:bg-red-50 px-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={20} />
                  <span className="text-sm font-medium">ອອກຈາກລະບົບ</span>
                </div>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-[30px] w-[90%] font-lao">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">
                  ຢືນຢັນການອອກຈາກລະບົບ
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500">
                  ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ?
                  ທ່ານຈະຕ້ອງໄດ້ເຂົ້າສູ່ລະບົບຄືນໃໝ່ເພື່ອເຂົ້າເຖິງຂໍ້ມູນ.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-3 mt-4">
                <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-none bg-slate-100 hover:bg-slate-200 mt-0">
                  ຍົກເລີກ
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoggingOut ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "ຢືນຢັນ"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
