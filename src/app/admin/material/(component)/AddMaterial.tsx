"use client";
import React, { useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DiamondPlus,
  ImagePlus,
  LinkIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Category_Material, Material, Material_Variant } from "../page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createMaterail } from "@/app/api/client/material";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export type VariantFormInput = {
  variant_name: string;
  barcode: string;
  price_kip: number;
  sell_price_kip: number;
  price_bath: number;
  sell_price_bath: number;
  quantity_in_parent: number | null;
  parent_variant_idx: number | null; // Virtual link for UI logic
  conver_to_base: number;
};

export interface MaterialFormState {
  name: string;
  descriptions: string;
  category_materialId: number | string;
  min_order: number;
  image: string;
  variants: VariantFormInput[];
}

interface Prop {
  category: Category_Material[];
}

const AddMaterial = ({}) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formData, setFormData] = useState<MaterialFormState>({
    name: "",
    descriptions: "",
    category_materialId: "",
    min_order: 60,
    image: "",
    variants: [
      {
        variant_name: "",
        barcode: "",
        price_kip: 0,
        sell_price_kip: 0,
        price_bath: 0,
        sell_price_bath: 0,
        quantity_in_parent: null,
        parent_variant_idx: null,
        conver_to_base: 1.0, // Base unit is always 1
      },
    ],
  });

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      descriptions: "",
      category_materialId: "",
      min_order: 60,
      image: "",
      variants: [
        {
          variant_name: "",
          barcode: "",
          price_kip: 0,
          sell_price_kip: 0,
          price_bath: 0,
          sell_price_bath: 0,
          quantity_in_parent: null,
          parent_variant_idx: null,
          conver_to_base: 1.0, // Base unit is always 1
        },
      ],
    });
    setImagePreview(null);
  };

  // --- AUTO CALCULATION LOGIC ---
  const updateCalculations = (variants: VariantFormInput[]) => {
    return variants.map((v, index) => {
      // 1. The first item is ALWAYS the Base Unit
      if (index === 0) {
        return {
          ...v,
          conver_to_base: 1.0,
          quantity_in_parent: null,
          parent_variant_idx: null,
        };
      }

      // 2. Every other item is a child of the one immediately before it
      const parent = variants[index - 1];

      // conver_to_base = (How many small units in the parent) * (How many parents in THIS unit)
      const currentQtyInParent = v.quantity_in_parent || 1;
      const newConverToBase = parent.conver_to_base * currentQtyInParent;

      return {
        ...v,
        conver_to_base: newConverToBase,
        parent_variant_idx: index - 1,
      };
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormInput,
    value: any,
  ) => {
    let newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };

    // If quantity changes, we must recalculate the whole chain
    if (field === "quantity_in_parent") {
      newVariants = updateCalculations(newVariants);
    }

    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    const newVariant: VariantFormInput = {
      variant_name: "",
      barcode: "",
      price_kip: 0,
      sell_price_kip: 0,
      price_bath: 0,
      sell_price_bath: 0,
      quantity_in_parent: 1,
      parent_variant_idx: formData.variants.length - 1,
      conver_to_base: 0, // Will be calculated below
    };

    const updatedVariants = updateCalculations([
      ...formData.variants,
      newVariant,
    ]);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeVariant = (index: number) => {
    if (index === 0) return;
    const filtered = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updateCalculations(filtered) });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the actual file for the FormData
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for the UI preview
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // 1. Append simple fields
    data.append("name", formData.name);
    data.append("descriptions", formData.descriptions);
    data.append("category_materialId", formData.category_materialId.toString());
    data.append("min_order", formData.min_order.toString());

    // 2. Append the Image File (Multer-S3 will look for this key, e.g., 'image')
    if (imageFile) {
      data.append("image", imageFile);
    }

    // 3. Append the Variants (Must be stringified for Multer to receive them)
    data.append("variants", JSON.stringify(formData.variants));

    startTransition(async () => {
      try {
        await createMaterail(data);
        handleClose();
        router.refresh();
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("ລອງໃຫ່ມພາຍຫລັງ.")
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          handleClose(); // Triggers whenever the dialog closes
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-lao h-10">
          <DiamondPlus className="mr-1 h-4 w-4" /> ເພີ່ມວັດຖຸດິບ
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto font-lao">
        <DialogHeader>
          <DialogTitle>ເພີ່ມວັດຖຸດິບ ແລະ ກຳນົດຫົວໜ່ວຍ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-8 space-y-4">
              <Label>ຊື່ວັດຖຸດິບ</Label>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="col-span-8 space-y-4">
              <Label>Min Order</Label>
              <Input
                type="number"
                defaultValue={60}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_order: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-span-8 space-y-4">
              <Label>ລາຍລະອຽດວັດຖຸດິບ</Label>
              <Input
                onChange={(e) =>
                  setFormData({ ...formData, descriptions: e.target.value })
                }
              />
            </div>
            <div className="col-span-8 space-y-4">
              <Label>ໝວດໝູ່ (Category)</Label>
              <Select
                value={formData.category_materialId.toString()} // shadcn needs a string
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category_materialId: Number(value), // Convert back to number for your schema
                  })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ເລືອກໝວດໝູ່..." />
                </SelectTrigger>
                <SelectContent className="font-lao">
                  <SelectItem value="1">ວັດຖຸດິບສາງກະຈາຍ</SelectItem>
                  <SelectItem value="2">ວັດຖຸດິບຈັດສົ່ງໜ້າຮ້ານ</SelectItem>
                </SelectContent>
              </Select>
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
                  required
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-bold">
                ລໍາດັບຫົວໜ່ວຍ (Unit Hierarchy)
              </Label>
              <Button
                type="button"
                onClick={addVariant}
                size="sm"
                className="bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" /> ເພີ່ມຫົວໜ່ວຍໃຫຍ່ຂຶ້ນ
              </Button>
            </div>

            {formData.variants.map((v, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="flex items-center justify-center my-2 opacity-50">
                    <LinkIcon className="h-4 w-4 rotate-90 text-blue-500" />
                    <span className="text-[10px] ml-2 text-blue-600 italic">
                      ບັນຈຸ {v.quantity_in_parent}{" "}
                      {formData.variants[i - 1].variant_name || "Unit ລຸ່ມ"} ໃນ
                      1 {v.variant_name || "Unit ນີ້"}
                    </span>
                  </div>
                )}

                <div className="relative p-5 border-2 rounded-xl bg-white shadow-sm hover:border-blue-200 transition-colors">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Unit Name */}
                    <div className="col-span-3 space-y-2 flex flex-col justify-between">
                      <Label className="text-xs font-bold">
                        {i === 0
                          ? "ຫົວໜ່ວຍນ້ອຍສຸດ (Base)"
                          : `ຫົວໜ່ວຍລະດັບ ${i + 1}`}
                      </Label>
                      <Input
                        placeholder="ເຊັ່ນ: ກ່ອງ, ແພັກ..."
                        value={v.variant_name}
                        onChange={(e) =>
                          handleVariantChange(i, "variant_name", e.target.value)
                        }
                      />
                    </div>

                    {/* Quantity in Parent */}
                    <div className="col-span-3 space-y-2 flex flex-col justify-between">
                      <Label className="text-xs font-bold text-orange-600">
                        ຈໍານວນບັນຈຸ
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          disabled={i === 0}
                          value={v.quantity_in_parent || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              i,
                              "quantity_in_parent",
                              Number(e.target.value),
                            )
                          }
                        />
                        <span className="text-[10px] text-slate-400">
                          {i > 0 ? formData.variants[i - 1].variant_name : ""}
                        </span>
                      </div>
                    </div>

                    {/* Logic Result */}
                    <div className="col-span-2 space-y-2 flex flex-col justify-between">
                      <Label className="text-xs font-bold text-blue-600">
                        ລວມ Base Unit
                      </Label>
                      <div className="h-9 px-3 bg-blue-50 border border-blue-100 rounded-md flex items-center font-mono text-blue-700 text-sm">
                        x {v.conver_to_base}
                      </div>
                    </div>

                    {/* Barcode */}
                    <div className="col-span-4 space-y-2 flex flex-col justify-between">
                      <Label className="text-xs font-bold">ບາໂຄດ</Label>
                      <Input
                        value={v.barcode}
                        onChange={(e) =>
                          handleVariantChange(i, "barcode", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Pricing Grid */}
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                    {/* KIP Costs */}
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label className="text-[10px]">ຕົ້ນທຶນ (KIP)</Label>
                      <Input
                        type="number"
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "price_kip",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label className="text-[10px] text-green-600 font-bold">
                        ຂາຍ (KIP)
                      </Label>
                      <Input
                        type="number"
                        className="border-green-200"
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "sell_price_kip",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    {/* BATH Costs */}
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label className="text-[10px]">ຕົ້ນທຶນ (BATH)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "price_bath",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label className="text-[10px] text-blue-600 font-bold">
                        ຂາຍ (BATH)
                      </Label>
                      <Input
                        type="number"
                        className="border-blue-200"
                        step="0.001"
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleVariantChange(
                            i,
                            "sell_price_bath",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>

                  {i > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeVariant(i)}
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> ບັນທຶກ...
                </>
              ) : (
                "ບັນທຶກລົງຖານຂໍ້ມູນ"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterial;
