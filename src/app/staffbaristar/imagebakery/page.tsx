"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  X,
  CloudUpload,
  CheckCircle2,
  Info,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios"; // Ensure axios is installed: npm install axios
import { useSession } from "../SessionProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import {
  getImageTracking,
  insertImageTrack,
} from "@/app/api/client/tracking_image";
import { startOfDay, differenceInDays } from "date-fns";

const ImageBakery = () => {
  const staff_detail = useSession();
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const today = startOfDay(new Date());
  const selected = startOfDay(selectedDate);
  const daysDifference = differenceInDays(today, selected);
  const isTooOld = daysDifference > 1;
  const isFuture = daysDifference < 0;
  const isDisabled = isTooOld || isFuture;

  useEffect(() => {
    const fecthImageTrack = async () => {
      try {
        const ress = await getImageTracking({
          track_date: dateString,
          branchId: staff_detail.branchId,
        });
        setUploadedUrls(ress.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (dateString && staff_detail?.branchId) {
      fecthImageTrack();
    }
  }, [selectedDate, staff_detail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Save File objects for the backend
      setFileObjects((prev) => [...prev, ...fileArray]);

      // Generate previews for the UI
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFileObjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (fileObjects.length === 0) return toast.error("ກະລຸນາເລືອກຮູບກ່ອນ");

    setIsUploading(true);

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    fileObjects.forEach((file) => {
      formData.append("images", file);
    });

    // Add other fields required by your schema
    formData.append("branchId", staff_detail?.branchId);
    formData.append("track_date", dateString);

    try {
      const response = await insertImageTrack(formData);

      if (response.status === 200) {
        toast.success("ອັບໂຫຼດຮູບພາບສຳເລັດ!");
        // Set the state to the URLs returned from your backend
        setUploadedUrls((prev) => [...prev, ...response.data.data]);
        // Clear local previews and files since upload is done
        setPreviews([]);
        setFileObjects([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດ");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24 font-lao">
      <div className="px-6 pt-12 pb-6 bg-[#402f22] text-white rounded-b-[30px] shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold italic tracking-tight">
              ອັປໂຫລດເບເກີລີ້
            </h1>
            <p className="text-gray-300 text-xs">
              ເລືອກວັນທີ ແລະ ອັບໂຫຼດຮູບພາບ
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
            <ImageIcon className="text-blue-400" size={24} />
          </div>
        </div>

        {/* 3. Calendar Popover in Header */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal h-12 rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>ເລືອກວັນທີ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-6 space-y-6">
        {/* Display Final Uploaded Images from Backend if they exist */}
        {uploadedUrls?.length > 0 && (
          <div className="space-y-2">
            <h2
              className={
                "text-sm font-bold text-green-600 flex items-center gap-2"
              }
            >
              <CheckCircle2 size={16} /> ຮູບທີ່ອັບໂຫຼດແລ້ວ:
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {uploadedUrls.map((url, i) => (
                /* 1. We need a relative container with a set aspect ratio */
                <div
                  key={i}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border shadow-sm bg-slate-100"
                >
                  <Image
                    alt={`uploaded-bakery-${i}`}
                    src={typeof url === "string" ? url : url.image_name}
                    fill
                    sizes="(max-width: 768px) 25vw, 10vw" // This tells mobile to use smaller size
                    className="object-cover"
                    priority={i < 4} // Helps load the first 4 images faster on mobile
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Main Upload Zone (Previews) */}
        {previews.length === 0 ? (
          <label
            className={cn(
              "flex flex-col items-center justify-center aspect-square w-full border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 hover:bg-slate-50 transition-all group cursor-pointer",
              isDisabled
                ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer",
            )}
          >
            <div className="p-6 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Camera size={48} className="text-blue-600" />
            </div>
            <span className="mt-4 font-bold text-slate-700">
              ຖ່າຍຮູບ ຫຼື ເລືອກຮູບ
            </span>
            <input
              type="file"
              multiple
              disabled={isDisabled}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {previews.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-md group"
              >
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white rounded-full p-1.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <CloudUpload className="text-slate-400 mb-1" size={24} />
              <span className="text-[10px] font-bold text-slate-400">
                ເພີ່ມຮູບ
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isDisabled}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        <div className="flex gap-3 p-4 bg-blue-50 rounded-3xl border border-blue-100">
          <Info className="text-blue-600 shrink-0" size={20} />

          {isDisabled ? (
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              <span className="text-red-500">
                ບໍ່ສາມາດອັປໂຫລດຮູບພາບເພີ່ມເຕີ່ມຫຼັງກາຍ 2 ມື້
                ຫລືລ່ວງຫນ້າມື້ປະຈຸຸບັນໄດ້.
              </span>
            </p>
          ) : (
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium flex flex-col">
              <span>
                - ກະລຸນາອັບໂຫຼດຮູບພາບ: ໜ້າຕູ້ເບເກີລີ,
                ສິນຄ້າຄົງເຫຼືອທັງຫມົດ,ຖ່າຍໃຫ້ເຫັນເບເກີລີ້ຊັດເຈນ
              </span>
              <span>
                - ກະລຸນາກວດຮູບພາບທີອັປໂຫລດໃຫ້ຖືກຕ້ອງກ່ອນກົດຢືນຢັນອັປໂຫລດ.
              </span>
              <span>
                - ກໍລະນີອັປໂຫລດໄປແລ້ວຕ້ອງການແກ້ໄຂແມ່ນໃຫ້ຕິດຕໍ່ພະແນກຈັດຊື້
              </span>
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            disabled={previews.length === 0 || isUploading}
            onClick={handleUploadAll}
            className="w-full h-16 rounded-3xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 text-lg font-bold gap-3"
          >
            {isUploading ? "ກຳລັງອັບໂຫຼດ..." : "ຢືນຢັນການອັບໂຫຼດ"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageBakery;
