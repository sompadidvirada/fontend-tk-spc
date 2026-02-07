"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, ImagePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMaterial } from "@/app/api/client/material";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Supplyer_Spc } from "./DetailSupplyer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface EditProps {
  material: any;
  category: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplyer_spc: Supplyer_Spc[];
}

const EditMaterial = ({
  material,
  category,
  supplyer_spc,
  isOpen,
  onClose,
  onSuccess,
}: EditProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category_materialId: 0,
    min_order: 0,
    descriptions: "",
    supplier_spcId: "", // Add this
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || "",
        category_materialId: material.category_materialId || 0,
        min_order: material.min_order || 0,
        descriptions: material.descriptions || "",
        // Ensure it handles null and converts to string for the Select component
        supplier_spcId: material.supplier_spcId?.toString() || "",
      });
      setImagePreview(material.image || "");
    }
  }, [material]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", material.id.toString());
    data.append("name", formData.name);
    data.append("category_materialId", formData.category_materialId.toString());
    data.append("min_order", formData.min_order.toString());
    data.append("descriptions", formData.descriptions);
    // Append supplier ID
    data.append("supplier_spcId", formData.supplier_spcId);

    if (imageFile) {
      data.append("image", imageFile);
    }

    startTransition(async () => {
      try {
        await updateMaterial(data, Number(material.id));
        onClose();
        toast.success("ອັປເດດສຳເລັດ");
        router.refresh();
      } catch (err) {
        console.error("Update failed", err);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-lao">
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນວັດຖຸດິບ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-32 w-32 cursor-pointer rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="text-slate-400" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-2">
            <Label>ຊື່ວັດຖຸດິບ</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>ບໍລິສັດຜູ້ສະໜອງ</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-lao bg-white"
                >
                  {formData.supplier_spcId
                    ? supplyer_spc.find(
                        (spc) => spc.id.toString() === formData.supplier_spcId,
                      )?.name
                    : "ເລືອກບໍລິສັດຜູ້ສະໜອງ..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 font-lao" align="start">
                <Command>
                  <CommandInput placeholder="ຄົ້ນຫາຊື່ຜູ້ສະໜອງ..." />
                  <CommandList>
                    <CommandEmpty>ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງ.</CommandEmpty>
                    <CommandGroup>
                      {supplyer_spc.map((spc) => (
                        <CommandItem
                          key={spc.id}
                          value={spc.name} // Command uses 'value' for searching
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              supplier_spcId: spc.id.toString(),
                            });
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.supplier_spcId === spc.id.toString()
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex items-center gap-2">
                            {spc.image && (
                              <img
                                src={spc.image}
                                className="h-5 w-5 rounded-full object-cover"
                                alt=""
                              />
                            )}
                            <span>{spc.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ໝວດໝູ່</Label>
              <Select
                value={formData.category_materialId.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, category_materialId: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {category.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      className="font-lao"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Min Order</Label>
              <Input
                type="number"
                value={formData.min_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_order: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              ຍົກເລີກ
            </Button>
            <Button type="submit" disabled={isPending}>
              ບັນທຶກ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaterial;
