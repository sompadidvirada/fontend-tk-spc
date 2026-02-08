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
import { useStaffStore } from "@/store/staff";
import {
  updateStaffPassword,
  updateStaffProfiles,
} from "@/app/api/client/staff";

const profileSchema = z.object({
  name: z.string(),
  old_password: z.string().min(1, "ກະລຸນາໃສ່ລະຫັດເກົ່າ"),
  new_password: z.string(),
  repeat_new_password: z.string(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditUserPasswrod = ({
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

  // 2. Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      old_password: "", // Initialize as empty string
      new_password: "",
      repeat_new_password: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (data.new_password !== data.repeat_new_password)
      return toast.error("ກະລຸນາພິມລະຫັດໃຫ່ມໃຫ້ຖືກຕ້ອງ");

    setLoading(true);
    try {
      const ress = await updateStaffPassword(
        { old_password: data.old_password, new_password: data.new_password },
        user.id,
      );
      onSuccess();
      toast.success(ress.data.message);
    } catch (err: any) {
      console.error(err);
      if (err.response.data.message === "ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ.") {
        toast.error("ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ.");
      } else {
        toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ");
      }
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
          </div>
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            disabled
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
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ລະຫັດເກົ່າ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ລະຫັດເກົ່າຂອງທ່ານ"
                    {...field}
                    type="password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ລະຫັດໃຫ່ມ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ລະຫັດໃຫ່ມ"
                    {...field}
                    type="password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeat_new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ພິມລະຫັດໃຫ່ມອີກຄັ້ງ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ພິມລະຫັດໃຫ່ມອີກຄັ້ງ"
                    {...field}
                    type="password"
                    required
                  />
                </FormControl>
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

export default EditUserPasswrod;
