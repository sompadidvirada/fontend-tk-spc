"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Coffee, UserRoundPlus, X } from "lucide-react";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { createStaffBaristar } from "@/app/api/client/staff";

const AddstaffBaristar = () => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL
    }
  };
  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    // Reset the input value so the same file can be picked again
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const staffName = formData.get("name") as string;

    // Manual appends for non-standard inputs
    if (date) formData.append("birthdate", date.toISOString());
    if (selectedImage) formData.append("image", selectedImage);
    startTransition(async () => {
      try {
        await createStaffBaristar(formData);

        toast.success("ສ້າງຢູເຊີພະນັກງານສຳເລັດ", {
          description: `${staffName}`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });

        router.refresh();
      } catch (error: any) {
        console.error("Error sending data:", error);
        if (error.status === 501) {
          toast.error("ເບີໂທນີ້ຖືກນຳໃຊ້ແລ້ວ", {
            description: `ກະລຸນານຳໃຊ້ເບີໂທໃຫ່ມໃນການສະໝັກ`,
            action: {
              label: "Undo",
              onClick: () => {},
            },
          });
          return;
        } else {
          toast.error("ເກີດຂໍ້ຜິດຜາດຂັ້ນຕອນສ້າງ", {
            description: `ກະລຸນາລອງໃຫ່ມພາຍຫລັງ`,
            action: {
              label: "Undo",
              onClick: () => {},
            },
          });
        }
      } finally {
        setOpen(false);
        setDate(undefined);
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 1. Trigger is outside the form */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-lao justify-start h-6 md:h-10 max-w-50"
        >
          <Coffee className="mr-1 h-4 w-4" /> ສ້າງໄອດີບາເລສຕ້າ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106 font-lao">
        {/* 2. Form wraps the content inside the Dialog */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>ເພີ່ມພະນັກງານບາເລສຕ້າ</DialogTitle>
            <DialogDescription className="text-[12px]">
              ສະໄອດີພະນັກງານສຳລັບການນຳໃຊ້ລະບົບ.
              ຫລັງຈາກໃສ່ຂໍ້ມູນຄົບແລ້ວມຫ້ກົດສົ່ງຟອມ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">ຊື່ພະນັກງານ</Label>
              <Input id="name" name="name" placeholder="ຊື່ພະນັກງານ" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phonenumber">ເບີໂທ</Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                placeholder="ເບີໂທ"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>ວັນເດືອນປິເກີດ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    className={cn(
                      "p-2 [--cell-size:--spacing(5)] text-sm"
                      // your other classes
                    )}
                    classNames={{
                      button_previous: "size-6",
                      button_next: "size-6",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="image">ຮູບພາບພະນັກງານ</Label>

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
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                ຍົກເລີກ
              </Button>
            </DialogClose>
            {/* 3. Ensure this is type="submit" */}
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "ສົ່ງຟອມ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddstaffBaristar;
