"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bakery_sold } from "./ParentTable";
import {
  deleteTrackingSell,
  sendTrackBakerySell,
  Track_Bakery_Sell,
} from "@/app/api/client/trackingbakery";
import EditTrackSell from "./EditTrackSell";
import { toast } from "sonner";


export type BakeryDetail = {
  id: number;
  name: string;
  price: number;
  sell_price: number;
  status: string;
  image?: string;
  bakery_categoryId: number;
};

interface CalendarProp {
  selectedDate: Date | undefined;
  data: BakeryDetail[];
  value: string;
  checkBakery: Bakery_sold[];
  setCheckBakery: React.Dispatch<React.SetStateAction<Bakery_sold[]>>;
}

const TableData = ({
  selectedDate,
  data,
  value,
  checkBakery,
  setCheckBakery,
}: CalendarProp) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Convert Date to string for FormData
    const dateToSend = selectedDate?.toLocaleDateString("en-CA");

    const dataToApi: Track_Bakery_Sell = {
      bakeryId: formData.get("bakeryId") as string,
      sold_at: dateToSend,
      branchId: value || "",
      quantity: formData.get("quantity") as string,
      price: formData.get("price") as string,
      sell_price: formData.get("sell_price") as string,
    };

    try {
      const ress = await sendTrackBakerySell(dataToApi);
      const newBakeryEntry = ress.data.data;
      setCheckBakery((prev) => {
        return [...prev, newBakeryEntry];
      });
      form.reset();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTrackingSell(id);
      setCheckBakery((prev) => prev.filter((item) => item.id !== id));
      toast.success("ລົບຍອດຂາຍສຳເລັດ", {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫລັງ", {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    }
  };

  const columns: ColumnDef<BakeryDetail>[] = [
    {
      accessorKey: "image",
      size: 50,
      header: "ຮູບພາບ",
      cell: ({ row }) => {
        const imageUrl =
          (row.getValue("image") as string) || "/images/login-bg.jpg";
        const name = row.getValue("name") as string;
        return (
          <div
            onClick={() => setSelectedViewImage(imageUrl)}
            className="relative cursor-zoom-in h-12 w-12 overflow-hidden rounded-md border border-gray-200"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-center object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ລາຍການ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return <div className="font-medium text-[11px]">{name}</div>;
      },
    },
    {
      id: "input_action",
      header: "ປ້ອນຈຳນວນ",
      cell: ({ row }) => {
        const id = row.original.id;

        // Check if this row's ID exists in our "already inserted" data
        const existingEntry = checkBakery.find(
          (item) => item.bakery_detailId === id,
        );

        // STATE A: Data already exists - Show Value + Edit + Delete
        if (existingEntry) {
          return (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-24 font-bold text-blue-600">
                ຍອດທີ່ບັນທືກ. ({existingEntry.quantity})
              </span>
              <EditTrackSell
                id={existingEntry.id}
                setCheckBakery={setCheckBakery}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(existingEntry.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        }

        // STATE B: No data - Show the Form (Input + Save)
        return (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input type="hidden" name="bakeryId" value={id} />
            <input type="hidden" name="price" value={row.original.price} />
            <input
              type="hidden"
              name="sell_price"
              value={row.original.sell_price}
            />
            <Input
              name="quantity"
              type="number"
              placeholder="0"
              className="w-24 h-8"
              defaultValue=""
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
              required
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="h-4 w-4 text-white" />
            </Button>
          </form>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ຕົ້ນທຶນ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return (
          <div className="font-medium text-xs">{formatCurrency(price)} ₭</div>
        );
      },
    },
    {
      accessorKey: "sell_price",
      header: "ລາຄາຂາຍ",
      cell: ({ row }) => {
        const sellPrice = parseFloat(row.getValue("sell_price"));
        return (
          <div className="font-medium text-green-600 text-xs">
            {formatCurrency(sellPrice)} ₭
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="rounded-md border font-lao bg-white">
      <Table className="min-w-200 table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                  className="h-10 px-4 text-left align-middle font-lao text-xs font-bold uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length && value ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາເພື່ອຄີຂໍ້ມູນຍອດຂາຍ.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/**DIALOG MODAL FOR IMAGE STAFF */}
      <Dialog
        open={!!selectedViewImage}
        onOpenChange={() => {
          setSelectedViewImage(null);
          setIsImageLoading(true); // Reset loading state when closed
        }}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none flex items-center justify-center">
          <DialogHeader className="hidden">
            <DialogTitle>Staff Preview</DialogTitle>
          </DialogHeader>

          <div className="relative h-[80vh] w-full flex items-center justify-center">
            {/* 1. THE SPINNER (Displays only when isImageLoading is true) */}
            {isImageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 rounded-lg">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground font-lao">
                  ກຳລັງໂຫລດຮູບ...
                </p>
              </div>
            )}

            {/* 2. THE IMAGE */}
            {selectedViewImage && (
              <Image
                src={selectedViewImage}
                alt="Full size staff image"
                fill
                className={`object-contain transition-opacity duration-500 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setIsImageLoading(false)} // THE TRIGGER
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableData;
