"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Store, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteSupplyer, updateSupplyer } from "@/app/api/client/supplyer";

export type Supplyer = {
  id: number;
  name: string;
  order_range: number;
  image?: string;
};

const DetailSupplyer = ({ supplyers }: { supplyers: Supplyer[] }) => {
  // State for controlling which dialog is open and which data it holds
  const [editingSupplyer, setEditingSupplyer] = useState<Supplyer | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>();
  const router = useRouter();

  React.useEffect(() => {
    if (editingSupplyer) {
      setPreviewUrl(editingSupplyer.image || null);
    } else {
      setPreviewUrl(null);
      setSelectedImage(null);
    }
  }, [editingSupplyer]);

  const confirmDelete = async () => {
    // Add your API delete logic here
    try {
      const ress = await deleteSupplyer(deletingId);
      console.log(ress)
      router.refresh();
      toast.success("ລົບສຳເລັດ")
    } catch (err) {
      console.log(err);
    }
    setDeletingId(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplyer) return;

    try {
      const formData = new FormData();
      formData.append("id", editingSupplyer.id.toString());
      formData.append("name", editingSupplyer.name);
      formData.append("order_range", editingSupplyer.order_range.toString());
      const supplyerName = formData.get("name") as string;
      const id = editingSupplyer.id;

      // Only append the image if a new one was selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await updateSupplyer(formData, id);

      toast.success(`ອັປເດດຂໍ້ມູນບໍລິສັດ ${supplyerName} ສຳເລັດ`);
      router.refresh();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setEditingSupplyer(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL
    }
  };

  // Handle removing the image
  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    // Reset the input value so the same file can be picked again
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2 font-lao">
            <Store className="w-4 h-4" />
            ລາຍລະອຽດຜູ້ສະໜອງ
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl font-lao">
          <DialogHeader>
            <DialogTitle className="font-lao">ຂໍ້ມູນຜູ້ສະໜອງທັງໝົດ</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ໂລໂກ້</TableHead>
                <TableHead>ຊື່ບໍລິສັັດ/ຮ້ານ</TableHead>
                <TableHead>ໄລຍະການສັ່ງ</TableHead>
                <TableHead className="text-right">ຈັດການ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplyers?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.image || ""}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.order_range} ມື້</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* EDIT BUTTON */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingSupplyer(item)}
                        className="text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* DELETE BUTTON */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeletingId(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* --- SECONDARY DIALOGS (Managed by State) --- */}

      {/* 1. EDIT DIALOG */}
      <Dialog
        open={!!editingSupplyer}
        onOpenChange={() => setEditingSupplyer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-lao">ແກ້ໄຂຜູ້ສະໜອງ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4 font-lao">
            <div className="space-y-2">
              <Label>ຊື່ຜູ້ສະໜອງ</Label>
              <Input
                value={editingSupplyer?.name || ""}
                onChange={(e) =>
                  setEditingSupplyer((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>ໄລຍະການສັ່ງ (ມື້)</Label>
              <Input
                type="number"
                value={editingSupplyer?.order_range || 0}
                onChange={(e) =>
                  setEditingSupplyer((prev) =>
                    prev
                      ? { ...prev, order_range: parseInt(e.target.value) }
                      : null,
                  )
                }
              />
            </div>

            <div className="grid gap-3 font-lao">
              <Label htmlFor="image">ຮູບພາບ</Label>

              {/* FIXED CONTAINER: w-full or w-60, aspect-video or aspect-square */}
              <div className="relative w-40 h-40 aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/50 overflow-hidden flex flex-col items-center justify-center transition-all">
                {previewUrl ? (
                  /* --- STATE 1: IMAGE PREVIEW --- */
                  <>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      className="object-contain"
                      fill
                    />

                    {/* X Button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md hover:scale-110 transition-transform"
                      onClick={removeImage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </>
                ) : (
                  /* --- STATE 2: EMPTY PLACEHOLDER --- */
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full hover:bg-muted/80 transition-colors"
                  >
                    <div className="bg-background p-2 rounded-full shadow-sm border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-muted-foreground"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">
                        ກົດເພື່ອອັບໂຫລດຮູບ
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        PNG, JPG (Max 5MB)
                      </p>
                    </div>
                    {/* Hidden Input inside the label makes the whole box clickable */}
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600">
              ບັນທຶກການປ່ຽນແປງ
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center justify-center text-center font-lao">
            <div className="bg-red-100 p-3 rounded-full mb-2">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <DialogTitle className="font-lao text-xl">
              ຢືນຢັນການລົບ?
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
            </p>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center font-lao">
            <Button variant="ghost" onClick={() => setDeletingId(null)}>
              ຍົກເລີກ
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              ຢືນຢັນການລົບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailSupplyer;
