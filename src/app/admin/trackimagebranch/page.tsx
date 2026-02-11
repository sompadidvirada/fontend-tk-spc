"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ImageOff,
  Phone,
  MapPin,
  MessageCircle,
  Pencil,
  CalendarIcon,
  ChevronDownIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  deleteImageTrack,
  getAllBranchImage,
} from "@/app/api/client/tracking_image";
import { addPhoneBranch } from "@/app/api/client/branchs";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Branch {
  id: string;
  name: string;
  phonenumber: string;
  province: string;
  available: string;
  track_image_bakery: Image_Detail[];
}

type Image_Detail = {
  id: number;
  image_name: string | "";
};

export default function BranchImageTracker() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [tempPhone, setTempPhone] = useState<string | "">("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [branchsImages, setBranchsImages] = useState<Branch[]>([]);
  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetImageId, setTargetImageId] = useState<number>();
  const router = useRouter();

  // Listen for slide changes
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const fecthBranchImage = async () => {
      const ress = await getAllBranchImage({ track_date: dateString });
      setBranchsImages(ress.data);
      try {
      } catch (err) {
        console.log(err);
      }
    };
    if (date) {
      fecthBranchImage();
    }
  }, [date]);

  const openWhatsApp = (phone: string) => {
    const cleanNumber = phone.replace(/\D/g, "");
    window.open(`https://web.whatsapp.com/85620${cleanNumber}`, "_blank");
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setTempPhone(branch.phonenumber); // Pre-fill with existing number
  };

  const handleSavePhone = async () => {
    if ( !editingBranch?.id) return;

    try {
      await addPhoneBranch({ phone: tempPhone }, Number(editingBranch.id));
      setBranchsImages((prev) =>
        prev.map((branch) =>
          branch.id === editingBranch.id
            ? { ...branch, phonenumber: tempPhone } // Keep everything, only overwrite phonenumber
            : branch,
        ),
      );
      toast.success("ເພີ່ມເບີໂທສຳເລັດ", {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setEditingBranch(null);
    }
  };

  const handleDeleteImage = async () => {
    if (!targetImageId) return;
    try {
      await deleteImageTrack(targetImageId);
      setBranchsImages((prev) =>
        prev.map((branch) => ({
          ...branch,
          // Filter the track_image_bakery array for each branch
          track_image_bakery: branch.track_image_bakery.filter(
            (img) => img.id !== targetImageId,
          ),
        })),
      );
      toast.success("ລົບຮູບພາບສຳເລັດ");
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedBranch(null);
      router.refresh();
    }
  };

  return (
    <div className="px-8 w-full mx-auto mt-3">
      <div className="flex justify-between items-end mb-6 font-lao">
        <div>
          <h1 className="text-2xl font-bold">ຮູບເບເກີລີ້ຄົງເຫລືອແຕ່ລະສາຂາ</h1>
          <p className="text-slate-500">ກວດສອບຮູບພາບເບເກີລີ້ຂອງແຕ່ລະສາຂາ</p>
        </div>
      </div>
      <div className="w-full flex justify-end my-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-lao"
            >
              {date
                ? new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  }).format(date)
                : "ເລືອກວັນທີ"}
              <div className="flex">
                <CalendarIcon />
                <ChevronDownIcon />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden font-lao">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="px-3">ຊື່ສາຂາ</TableHead>
              <TableHead className="px-3">ສະຖານະອັປໂຫລດ</TableHead>
              <TableHead className="px-3">ແກ້ໄຂເບີຕິດຕໍ່</TableHead>
              <TableHead className="px-3">ຕິດຕໍ່ສາຂາ</TableHead>
              <TableHead className="text-right px-3">ເບີ່ງຮູບທັງໝົດ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchsImages
              ?.filter(
                (branch) =>
                  branch.name !== "ສາຂາ ເມືອງງາ" && branch.name !== "ສຳນັກງານໃຫ່ຍ",
              ) // Filter out IDs 5 and 7
              .map((branch) => (
                <TableRow key={branch.id} className="group">
                  <TableCell className="px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {branch.name}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {branch.phonenumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3">
                    {branch.track_image_bakery.length > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 h-8 border-blue-100"
                      >
                        {branch.track_image_bakery.length} Photos Uploaded
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-slate-400 border-dashed"
                      >
                        No Uploads
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-3">
                    <div className="flex items-center gap-3 w-50 justify-between">
                      <span className="text-sm font-mono text-slate-600">
                        {branch.phonenumber || "No Number"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(branch)}
                        className="h-8 px-2 text-slate-500"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        {branch.phonenumber ? "ແກ້ໄຂເບີໂທ" : "ເພີ່ມເບີໂທ"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-3">
                    {branch.phonenumber ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 text-green-100 bg-green-600 rounded-2xl border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={() => openWhatsApp(branch.phonenumber)}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        ສົ່ງຂໍ້ຄວາມ
                      </Button>
                    ) : (
                      <span className="opacity-50">none</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right px-3">
                    {branch.track_image_bakery.length === 0 ? (
                      <span className="opacity-50">none</span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBranch(branch)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4 mr-2" /> Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG: EDIT PHONE NUMBER */}
      <Dialog
        open={!!editingBranch}
        onOpenChange={() => setEditingBranch(null)}
      >
        <DialogContent className="sm:max-w-[425px] font-lao">
          <DialogHeader>
            <DialogTitle>ແກ້ໄຂເບີໂທສາຂາ</DialogTitle>
            <p className="text-sm text-muted-foreground">
              ໃສ່ເບີຕິດຕໍ່ຂອງສາຂາ "<strong>{editingBranch?.name}</strong>{" "}
              ຕ້ອງເປັນເບີທີ່ມີ Whatsapp"
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-4 font-lao">
            <div className="grid gap-2">
              <Label htmlFor="phone">ເບີຕິດຕໍ່</Label>
              <Input
                id="phone"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="e.g. 51778411"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingBranch(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePhone}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Image Review Modal */}
      <Dialog
        open={!!selectedBranch}
        onOpenChange={() => setSelectedBranch(null)}
      >
        <DialogTitle className="flex-none"></DialogTitle>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-secondary border-none font-lao">
          <div className="absolute top-1 left-4 z-50">
            <Badge className="bg-gray-800  text-white border-none text-xs px-4 py-1">
              {selectedBranch?.name}
            </Badge>
          </div>
          <div className="absolute top-8 left-4 z-50">
            <Badge className="bg-gray-800  text-white border-none text-xs px-4 py-1">
              {dateString}
            </Badge>
          </div>
          <div className="absolute bottom-1 left-4 z-50">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="font-lao"
              onClick={() => {
                // Get the image object based on the current visible slide
                const imageToDelete =
                  selectedBranch?.track_image_bakery[currentIndex];

                if (imageToDelete) {
                  // You can store this in a state to pass to your AlertDialog
                  setTargetImageId(imageToDelete.id);
                  setIsDeleteDialogOpen(true);
                }
              }}
            >
              ລົບຮູບພາບນິ້
            </Button>
          </div>

          <div className="flex items-center justify-center min-h-[600px] w-full group">
            {selectedBranch && selectedBranch.track_image_bakery.length > 0 ? (
              <Carousel setApi={setApi} className="w-full h-full">
                <CarouselContent>
                  {selectedBranch.track_image_bakery.map((img, index) => (
                    <CarouselItem
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <div className="relative w-full h-[600px] flex items-center justify-center">
                        <Image
                          src={img.image_name}
                          alt={`${selectedBranch?.track_image_bakery} upload ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority={index === 0} // Load the first image immediately
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                          <Badge
                            variant="outline"
                            className="bg-black/50 text-white border-white/20"
                          >
                            {index + 1} /{" "}
                            {selectedBranch.track_image_bakery.length}
                          </Badge>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Only show arrows if there is more than 1 image */}
                {selectedBranch.track_image_bakery.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Carousel>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
      {/**DIALOG CONFIRM DELETE IMAGE PREVIEW */}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="font-lao">
          <AlertDialogHeader>
            <AlertDialogTitle>ທ່ານແນ່ໃຈບໍ?</AlertDialogTitle>
            <AlertDialogDescription>
              ການລົບຮູບພາບນີ້ຈະບໍ່ສາມາດກູ້ຄືນໄດ້. ທ່ານຕ້ອງການລົບແທ້ບໍ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                handleDeleteImage(); // Call your delete function
                setIsDeleteDialogOpen(false);
              }}
            >
              ຢືນຢັນການລົບ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
