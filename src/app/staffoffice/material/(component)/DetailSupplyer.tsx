"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DiamondPlus,
  ExternalLink,
  Phone,
  Building2,
  Save,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSupplyerSpc } from "@/app/api/client/supplyer";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo Data
// Hardcoded Categories
const CATEGORIES = [
  { value: "THAI", label: "ວັດຖຸດິບສັ່ຈາກປະເທດໄທ" },
  { value: "LAO", label: "ວັດຖຸດິບສັ່ງໃນປະເທດລາວ" },
  { value: "OTHER", label: "ສັ່ງຈາກອື່ນໆ" },
];

export type Supplyer_Spc = {
  id: string;
  name: string;
  image: string | null;
  contact_name: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

const DetailSupplyer = ({ supplyer_spc }: { supplyer_spc: Supplyer_Spc[] }) => {
  const [suppliers, setSuppliers] = useState(supplyer_spc);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleEditClick = (supplier: any) => {
    setEditingSupplier(supplier);
    setPreviewUrl(supplier.image); // Set current image as preview
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show new image preview
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", editingSupplier.name);
    data.append("contact_name", editingSupplier.contact_name);
    data.append("phone", editingSupplier.phone);
    data.append("address", editingSupplier.address);
    data.append("category", editingSupplier.category);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      // Replace with your actual update API route
      const ress = await updateSupplyerSpc(data, editingSupplier.id);
      toast.success("ອັບເດດຂໍ້ມູນສຳເລັດ");
      setIsEditDialogOpen(false);
      // Optional: trigger a refresh here
      router.refresh();
    } catch (error: any) {
      toast.error("ບໍ່ສາມາດອັບເດດໄດ້: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-lao justify-start h-6 md:h-10 max-w-50"
          >
            <DiamondPlus className="mr-1 h-4 w-4" /> ລາຍລະອຽດບໍລິສັດຜູ້ສະໜອງ
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-180 max-h-[80vh] overflow-y-auto font-lao">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="text-blue-600" />{" "}
              ລາຍຊື່ບໍລິສັດຜູ້ສະໜອງທັງໝົດ
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 border rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {/* Added Image Header */}
                  <TableHead className="w-[80px]">ຮູບພາບ</TableHead>
                  <TableHead className="w-[200px]">ຊື່ບໍລິສັດ</TableHead>
                  <TableHead>ໝວດໝູ່</TableHead>
                  <TableHead>ຜູ້ຕິດຕໍ່</TableHead>
                  <TableHead>ເບີໂທລະສັບ</TableHead>
                  <TableHead className="text-right">ການຈັດການ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplyer_spc.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-slate-50/50">
                    {/* Image Cell */}
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                        {supplier.image ? (
                          <img
                            src={supplier.image}
                            alt={supplier.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 size={20} className="text-slate-400" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-bold text-slate-700 w-[200px] whitespace-normal break-words">
                      {supplier.name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-normal text-blue-600 bg-blue-50 hover:bg-blue-100 border-none"
                      >
                        {supplier.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {supplier.contact_name}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Phone size={12} className="text-blue-500" />
                        {supplier.phone}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                        onClick={() => handleEditClick(supplier)}
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/**EDIT SUPPLYER DIALOG */}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md font-lao">
          <DialogHeader>
            <DialogTitle>ແກ້ໄຂຂໍ້ມູນ: {editingSupplier?.name}</DialogTitle>
          </DialogHeader>

          {editingSupplier && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              {/* Image Preview & Upload */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200 shadow-inner bg-slate-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-full w-full p-6 text-slate-300" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <Upload className="mr-2 h-3 w-3" /> ປ່ຽນຮູບພາບ
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-2">
                <Label>ຊື່ບໍລິສັດ</Label>
                <Input
                  value={editingSupplier.name}
                  onChange={(e) =>
                    setEditingSupplier({
                      ...editingSupplier,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ຜູ້ຕິດຕໍ່</Label>
                  <Input
                    value={editingSupplier.contact_name}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        contact_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>ເບີໂທ</Label>
                  <Input
                    value={editingSupplier.phone}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ໝວດໝູ່ *</Label>
                <Select
                  onValueChange={(value) =>
                    setEditingSupplier({ ...editingSupplier, category: value })
                  }
                  value={editingSupplier.category}
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

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
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
                    <>
                      <Save className="mr-2 h-4 w-4" /> ບັນທຶກ
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailSupplyer;
