"use client";

import React, { useEffect, useState } from "react";
import { Camera, Send, X, Plus, Image as ImageIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "../SessionProvider"; // Assuming you use this for IDs
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { createReportBaristar } from "@/app/api/client/baristar";
import { getBakerysAvailable } from "@/app/api/client/trackingbakery";
import { BakeryDetail } from "@/app/admin/tracksell/(component)/TableData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReportBakery = () => {
  const staff_detail = useSession();

  // States
  const [previews, setPreviews] = useState<string[]>([]); 
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bakerys, setBakerys] = useState<BakeryDetail[]>([]);
  const [selectedBakeryId, setSelectedBakeryId] = useState<string>("");

  useEffect(() => {
    const fecthAvailableBakery = async () => {
      const ress = await getBakerysAvailable({
        branchId: Number(staff_detail.branchId),
      });
      setBakerys(ress.data.data);
    };
    if (staff_detail.branchId) {
      fecthAvailableBakery();
    }
  }, []);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      if (fileObjects.length + fileArray.length > 5) {
        return toast.error("ອັບໂຫຼດໄດ້ສູງສຸດ 5 ຮູບ");
      }

      setFileObjects((prev) => [...prev, ...fileArray]);

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

  const handleSubmit = async () => {
    // 1. Validation
    if (!title) return toast.error("ກະລຸນາເລືອກຫົວຂໍ້ບັນຫາ");
    if (!selectedBakeryId) return toast.error("ກະລຸນາເລືອກເບເກີລີ້");
    if (!description) return toast.error("ກະລຸນາເພີ່ມລາຍລະອຽດ");
    if (fileObjects.length === 0)
      return toast.error("ກະລຸນາແນບຮູບພາບຢ່າງໜ້ອຍ 1 ຮູບ");

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("report_date", format(new Date(), "yyyy-MM-dd"));
      formData.append("title", title);
      formData.append("descriptoion", description);
      formData.append("bakery_detailId", selectedBakeryId);
      formData.append("branchId", staff_detail?.branchId);
      formData.append("staff_officeId", staff_detail?.id);

      fileObjects.forEach((file) => {
        formData.append("images", file); // Must match your Multer upload name
      });
      const ress = await createReportBaristar(formData);
      toast.success("ສົ່ງລາຍງານສຳເລັດແລ້ວ!");
      setPreviews([]);
      setFileObjects([]);
      setDescription("");
      setSelectedBakeryId("");
      setTitle("");
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      toast.error("ເກີດຂໍ້ຜິດພາດ");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 font-lao">
      <div className="bg-[#402f22] px-6 pt-12 pb-6 border-b rounded-b-[30px] shadow-sm">
        <h1 className="text-2xl font-bold text-gray-200">ລາຍງານບັນຫາ</h1>
        <p className="text-sm text-gray-200">
          ສົ່ງຂໍ້ມູນສິນຄ້າເສຍ ຫຼື ພົບຄວາມຜິດພາດ
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Title Selection */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
            ຫົວຂໍ້ບັນຫາ
          </Label>
          <Select onValueChange={(val) => setTitle(val)} value={title}>
            <SelectTrigger className="w-full h-12 bg-white rounded-2xl border-slate-200 shadow-sm">
              <SelectValue placeholder="ເລືອກຫົວຂໍ້..." />
            </SelectTrigger>
            <SelectContent className="font-lao">
              <SelectItem value="ສິນຄ້າເສຍ/ເນົ່າກ່ອນກຳນົດ">
                ສິນຄ້າເສຍ/ເນົ່າກ່ອນກຳນົດ
              </SelectItem>
              <SelectItem value="ຫນ້າຕາສິນຄ້າບໍ່ຕົງປົກ">
                ຫນ້າຕາສິນຄ້າບໍ່ຕົງປົກ
              </SelectItem>
              <SelectItem value="ພົບສິ່ງເຈືອປົນ">ພົບສິ່ງເຈືອປົນ</SelectItem>
              <SelectItem value="ອື່ນໆ">ອື່ນໆ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Bakery Selection with Avatar Display */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
            ເລືອກເບເກີລີ້ທີ່ມີບັນຫາ
          </Label>
          <Select
            onValueChange={(val) => setSelectedBakeryId(val)}
            value={selectedBakeryId}
          >
            <SelectTrigger className="w-full h-14 bg-white rounded-2xl border-slate-200 shadow-sm">
              <SelectValue placeholder="ຄົ້ນຫາເບເກີລີ້..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {bakerys?.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id.toString()}
                  className="cursor-pointer py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg border">
                      <AvatarImage src={item.image} className="object-cover" />
                      <AvatarFallback className="text-[10px]">
                        BK
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              ຮູບພາບປະກອບ ({previews.length}/5)
            </Label>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {previews.length < 5 && (
              <label className="flex-shrink-0 w-28 h-28 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full mb-1">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  ເພີ່ມຮູບ
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}

            {previews.map((img, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
            ລາຍລະອຽດບັນຫາ
          </Label>
          <Textarea
            placeholder="ພິມລາຍລະອຽດທີ່ນີ້..."
            className="min-h-[120px] bg-white border-slate-200 rounded-2xl shadow-sm p-4 text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl text-base font-bold gap-2 mt-4"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "ກຳລັງປະມວນຜົນ..." : "ຢືນຢັນການສົ່ງລາຍງານ"}
        </Button>
      </div>
    </div>
  );
};

export default ReportBakery;
