"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-mobile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Croissant, UserCog } from "lucide-react";
import { Bakery_Detail, Supplyer } from "./TableBakery";
import { Category_Bakery } from "./AddBakery";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import { editBakery } from "@/app/api/client/bakery";
import { Spinner } from "@/components/ui/spinner";

interface Edit_BakeryProps {
  bakery_selected: Bakery_Detail;
  categoryBakery: Category_Bakery[];
  supplyer: Supplyer[];
}

const EditBakery = ({
  bakery_selected,
  categoryBakery,
  supplyer,
}: Edit_BakeryProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <Croissant className="w-7 h-7" />
      ແກ້ໄຂຂໍ້ມູນ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ແກ້ໄຂຂໍ້ມູນ: {bakery_selected.name}
            </DialogTitle>
          </DialogHeader>
          <ProfileForm
            bakery_selected={bakery_selected}
            categoryBakery={categoryBakery}
            supplyer={supplyer}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-lao">
            ແກ້ໄຂຂໍ້ມູນ: {bakery_selected.name}
          </DrawerTitle>
        </DrawerHeader>
        <ProfileForm
          bakery_selected={bakery_selected}
          categoryBakery={categoryBakery}
          setOpen={setOpen}
          supplyer={supplyer}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="font-lao">
              ຍົກເລີກ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditBakery;

function ProfileForm({
  className,
  bakery_selected,
  categoryBakery,
  supplyer,
  setOpen,
}: {
  className?: string;
  bakery_selected: Bakery_Detail;
  categoryBakery: Category_Bakery[];
  supplyer: Supplyer[];
  setOpen: (open: boolean) => void;
}) {
  const [category, setCategory] = React.useState(
    bakery_selected.bakeryCategory?.id.toString(),
  );
  const [supplyers, setSupplyer] = React.useState(
    bakery_selected.supplyer_bakery?.id.toString(),
  );
  const [isPending, startTransition] = React.useTransition();
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    bakery_selected.image,
  );
  const router = useRouter();

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

  const handleUpdateBakery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (category) formData.append("bakeryCategoryId", category);
    if (category) formData.append("supplyer_bakeryId", supplyers);
    if (selectedImage && selectedImage.name !== bakery_selected.image)
      formData.append("image", selectedImage);

    //delete the comma inside the price and sell price

    const keysToClean = ["price", "sell_price"];
    keysToClean.forEach((key) => {
      const value = formData.get(key);
      if (typeof value === "string") {
        formData.set(key, value.replace(/,/g, ""));
      }
    });
    const dataForm = Object.fromEntries(formData) as Record<string, string>;

    const isUnchanged =
      dataForm.name === bakery_selected.name &&
      Number(dataForm.supplyer_bakeryId) ===
        bakery_selected.supplyer_bakeryId &&
      Number(dataForm.price) === bakery_selected.price &&
      Number(dataForm.sell_price) === bakery_selected.sell_price &&
      Number(dataForm.bakeryCategoryId) === bakery_selected.bakeryCategory.id &&
      previewUrl === bakery_selected.image;

    if (isUnchanged) {
      toast.info("ຂໍ້ມູນຄືເກົ່າ, ບໍ່ມີການອັບເດດ");
      setOpen(false); // Close dialog
      return; // Stop execution
    }
    startTransition(async () => {
      try {
        await editBakery(formData, Number(dataForm.id));
        toast.success(`ອັບເດດລາຍການ ${dataForm.name} ສຳເລັດ`, {
          cancel: {
            label: "x",
            onClick: () => {},
          },
        });
        router.refresh();
        setOpen(false);
      } catch (err) {
        console.log(err);
        toast.success("ມີບາງຢ່າງຜິດພາດ", {
          cancel: {
            label: "x",
            onClick: () => {},
          },
        });
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <form
      onSubmit={handleUpdateBakery}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="grid gap-3 font-lao">
        <input type="hidden" name="id" value={bakery_selected.id} />
        <Label htmlFor="name">ຊື່ເບເກີລີ້</Label>
        <Input
          id="name"
          name="name"
          defaultValue={bakery_selected.name}
          className="bg-muted"
        />
      </div>

      <div className="grid gap-3 font-lao">
        <Label htmlFor="role" className="font-lao">
          ໝວດໝູ່
        </Label>
        {/* 2. Controlled Select component */}
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="border-slate-200 w-full">
            <SelectValue placeholder="ເລືອກໝວດໝູ່" />
          </SelectTrigger>
          <SelectContent className="font-lao">
            {categoryBakery &&
              categoryBakery?.map((item, i) => (
                <SelectItem key={i} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 font-lao">
        <Label htmlFor="role" className="font-lao">
          ບໍລິສັດ/ຮ້ານ
        </Label>
        {/* 2. Controlled Select component */}
        <Select onValueChange={setSupplyer} value={supplyers}>
          <SelectTrigger className="border-slate-200 w-full">
            <SelectValue placeholder="ເລືອກບໍລິສັດ/ຮ້ານ" />
          </SelectTrigger>
          <SelectContent className="font-lao">
            {supplyer &&
              supplyer?.map((item, i) => (
                <SelectItem key={i} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="role" className="font-lao">
          ລາລາຕົ້ນທຶນ
        </Label>
        <NumericFormat
          customInput={Input}
          thousandSeparator={true}
          valueIsNumericString={true}
          placeholder="ລາຄາຕົ້ນທຶນ"
          name="price"
          defaultValue={bakery_selected.price}
          className="font-lao"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="role" className="font-lao">
          ລາຄາຂາຍ
        </Label>
        <NumericFormat
          customInput={Input} // Use Shadcn Input as the base
          thousandSeparator={true}
          valueIsNumericString={true}
          placeholder="ລາຄາຂາຍ"
          name="sell_price"
          defaultValue={bakery_selected.sell_price}
          className="font-lao"
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

      <Button type="submit" disabled={isPending} className="font-lao w-full">
        {isPending ? <Spinner className="h-4 w-4 animate-spin" /> : "ຢືນຢັນ"}
      </Button>
    </form>
  );
}
