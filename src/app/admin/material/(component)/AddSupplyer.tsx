"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { DiamondPlus, HousePlug, HousePlus, ImagePlus, Loader2, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { createSupplyerSpc } from "@/app/api/client/supplyer";
import { useRouter } from "next/navigation";

// Hardcoded Categories
const CATEGORIES = [
  { value: "THAI", label: "ວັດຖຸດິບສັ່ຈາກປະເທດໄທ" },
  { value: "LAO", label: "ວັດຖຸດິບສັ່ງໃນປະເທດລາວ" },
  { value: "OTHER", label: "ສັ່ງຈາກອື່ນໆ" },
];

const AddSupplyer = ({ onRefresh }: { onRefresh?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    phone: "",
    address: "",
    category: "", // State for category
    rating: "5",
    image: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file); // Store the actual file for the FormData
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for the UI preview
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleClose = () => {
    setFormData({
      name: "",
      contact_name: "",
      phone: "",
      address: "",
      category: "", // State for category
      rating: "5",
      image: "",
    });
    setImagePreview(null);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error("ກະລຸນາເລືອກໝວດໝູ່");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("image", file);
    

    try {
      await createSupplyerSpc(data);
      router.refresh();
      toast.success("ບັນທຶກຜູ້ສະໜອງສຳເລັດ");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດ");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-lao h-10">
          <HousePlus className="mr-1 h-4 w-4" /> ເພີ່ມບໍລິສັດຜູ້ສະໜອງ
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-lao">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            ເພີ່ມຂໍ້ມູນຜູ້ສະໜອງໃໝ່
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ຊື່ບໍລິສັດຜູ້ສະໜອງ *</Label>
              <Input
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Category Select Section */}
            <div className="space-y-2">
              <Label>ໝວດໝູ່ *</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                value={formData.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- ເລືອກໝວດໝູ່ --" />
                </SelectTrigger>
                <SelectContent className="font-lao">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ຊື່ຜູ້ຕິດຕໍ່</Label>
              <Input
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>ເບີໂທລະສັບ</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>ທີ່ຢູ່</Label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-8 space-y-4">
            <Label>ຮູບພາບວັດຖຸດິບ</Label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                      <ImagePlus className="text-white h-6 w-6" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <ImagePlus className="h-8 w-8 mb-1" />
                    <span className="text-[10px]">ເລືອກຮູບ</span>
                  </div>
                )}
              </div>

              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" /> ລຶບຮູບອອກ
                </Button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              ຍົກເລີກ
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ບັນທຶກຂໍ້ມູນ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplyer;
