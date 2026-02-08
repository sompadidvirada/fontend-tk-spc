"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Camera, Loader2, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateSessionAction } from "@/app/(lib)/update_session";
import { useStaffStore } from "@/store/staff";
import { updateStaffProfiles } from "@/app/api/client/staff";

const profileSchema = z.object({
  name: z.string().min(2, "ຊື່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ"),
  // Accept either a File object or a string (URL)
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
  birthdate: z.date({ error: "ກະລຸນາເລືອກວັນເດືອນປີເກີດ" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditUserForm = ({
  user,
  onSuccess,
}: {
  user: any;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setStaff = useStaffStore((state) => state.setStaff);
  const router = useRouter()

  // 2. Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
      birthdate: user.birth_date ? new Date(user.birth_date) : undefined,
    },
  });

  // Handle File Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file); // Set the file object in form state
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // Update the visual preview
    }
  };

  // Remove Image Logic
  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue("image", ""); // Clear form state
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear physical input
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("birthdate", data.birthdate.toISOString());

    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (!previewUrl) {
      // If user clicked 'X' and previewUrl is null, tell backend to remove image
      formData.append("image", "null");
    }

    try {
      const response = await updateStaffProfiles(formData, user.id);

      if (response && response.data.user) {
        setStaff({
          id: response.data.user.id,
          name: response.data.user.name,
          phonenumber: response.data.user.phone_number,
          role: response.data.user.role,
          image: response.data.user.image,
          birthdate: response.data.user.birth_date,
          branchId: response.data.user.branchId,
          branch_name: response.data.user.branch_name,
        });
        onSuccess();
        toast.success("ແກ້ໄຂຂໍ້ມູນສຳເລັດ!");
        router.refresh()
      }
    } catch (err) {
      console.error(err);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 font-lao"
      >
        {/* 1. Image Preview with "X" Remove Button */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Avatar className="h-28 w-28 border-2 border-primary/20">
              <AvatarImage
                src={previewUrl ? previewUrl : undefined}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted">
                <User className="h-14 w-14 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            {/* Remove Button (Top Right) */}
            {previewUrl && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Upload Trigger Button (Bottom Right) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                <FormControl>
                  <Input placeholder="ໃສ່ຊື່ຂອງທ່ານ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Birthdate Field */}
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>ວັນເດືອນປີເກີດ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yy")
                        ) : (
                          <span>ເລືອກວັນທີ</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          ບັນທຶກການປ່ຽນແປງ
        </Button>
      </form>
    </Form>
  );
};

export default EditUserForm;
