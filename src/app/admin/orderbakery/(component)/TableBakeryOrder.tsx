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
import { ArrowUpDown, BadgeCheck, Check, Loader2, Trash2 } from "lucide-react";
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
import {
  deleteTrackingSell,
  sendTrackBakerySell,
  Track_Bakery_Sell,
} from "@/app/api/client/trackingbakery";
import { toast } from "sonner";
import { Data_Order_Bakery, Order_Bakery } from "./ParentContent";
import {
  deleteORderBakery,
  insertManyOrderBakery,
  insertOrderBakery,
} from "@/app/api/client/order_bakery";
import EditOrderBakery from "./EditOrderBakery";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type BakeryDetail = {
  id: number;
  name: string;
  price: number;
  sell_price: number;
  status: string;
  image?: string;
  bakery_categoryId: number;
};

interface OrderBakeryProp {
  selectedDate: Date | undefined;
  data: BakeryDetail[];
  value: string;
  checkDataOrder: Data_Order_Bakery[];
  checkOrderBakery: Order_Bakery[];
  setCheckOrderBakery: React.Dispatch<React.SetStateAction<Order_Bakery[]>>;
  previousOrder: Order_Bakery[];
  result: any[];
  loading: boolean;
}

export type Order_Bake_Api_Body = {
  order_at: string;
  order_set: number;
  bakery_detailId: number;
  branchId: number;
};

const TableBakeryOrder = ({
  selectedDate,
  data,
  value,
  checkDataOrder,
  checkOrderBakery,
  setCheckOrderBakery,
  previousOrder,
  result,
  loading,
}: OrderBakeryProp) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();
  const [loadingId, setLoadingId] = React.useState<number | null>(null);
  const dayName = selectedDate?.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const historyMap = React.useMemo(() => {
    const map: Record<number, any> = {};
    checkDataOrder.forEach((item) => {
      map[item.bakery_detailId] = item;
    });
    return map;
  }, [checkDataOrder]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const id = Number(formData.get("bakery_detailId")); // Ensure this matches row.original.id

    setLoadingId(id); // <--- IMPORTANT: Set the ID here
    // 1. Convert Date to string for FormData
    const dateToSend = selectedDate?.toLocaleDateString("en-CA");

    const dataToApi = {
      bakery_detailId: formData.get("bakery_detailId") as string,
      order_at: dateToSend,
      branchId: value,
      order_set: formData.get("order_set") as string,
    };
    startTransition(async () => {
      try {
        const ress = await insertOrderBakery(dataToApi);
        setCheckOrderBakery((prev) => [...prev, ress.data]);
        form.reset();
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleDelete = async (recordId: number, bakeryDetailId: number) => {
    setLoadingId(bakeryDetailId);
    startTransition(async () => {
      try {
        await deleteORderBakery(recordId);
        setCheckOrderBakery((prev) =>
          prev.filter((item) => item.id !== recordId),
        );
      } catch (err) {
        console.log(err);
        toast.error("ລອງໃຫ່ມພາຍຫລັງ", {
          cancel: {
            label: "x",
            onClick: () => {},
          },
        });
      } finally {
        setLoadingId(null);
      }
    });
  };
  const columns: ColumnDef<BakeryDetail>[] = [
    {
      accessorKey: "image",
      size: 60,
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
      size: 180,
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
        return (
          <div className="font-medium text-[11px] whitespace-normal break-words leading-tight">
            {name}
          </div>
        );
      },
    },
    {
      id: "input_action",
      header: "ຈຳນນວນສັ່ງລົງ",
      size: 190,
      cell: ({ row }) => {
        const id = row.original.id;
        const existingEntry = checkOrderBakery.find(
          (item) => item.bakery_detailId === id,
        );

        // Check if THIS specific row is the one being processed
        const isThisRowLoading = loadingId === id && isPending;

        if (existingEntry) {
          return (
            <div className="flex items-center gap-1 text-xs">
              <span className="w-24 font-bold text-blue-600">
                ຍອດທີ່ບັນທືກ. ({existingEntry.order_set})
              </span>
              <EditOrderBakery
                setCheckOrderBakery={setCheckOrderBakery}
                id={existingEntry.id}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(existingEntry.id, id)}
                disabled={isPending} // Disable all buttons during any transition
              >
                {isThisRowLoading ? (
                  <Spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </div>
          );
        }

        return (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input type="hidden" name="bakery_detailId" value={id} />
            <Input
              name="order_set"
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
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              {isThisRowLoading ? (
                <Spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 text-white" />
              )}
            </Button>
          </form>
        );
      },
    },
    {
      accessorKey: "order_want",
      header: "ຈຳນວນຕ້ອງການ",
      size: 100,
      cell: ({ row }) => {
        const orderWant = checkOrderBakery.find(
          (item) => item.bakery_detailId === row.original.id,
        );
        return (
          <div className="font-medium text-green-600 text-xs">
            {orderWant && orderWant.order_want !== 0 ? (
              <Badge className="bg-blue-700 text-blue-50">
                <BadgeCheck data-icon="inline-start" />
                {orderWant.order_want}
              </Badge>
            ) : (
              <Badge className="bg-blue-50 text-blue-700">
                <BadgeCheck data-icon="inline-start" />
                -
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "order_set_previous",
      header: "ຈຳນວນກ່ອນຫນ້າ",
      size: 100,
      cell: ({ row }) => {
        const orderSetPrevious = previousOrder.find(
          (item) => item.bakery_detailId === row.original.id,
        );
        return (
          <div className="font-medium text-green-600 text-xs">
            <Badge className="bg-yellow-200 text-yellow-700">
              <BadgeCheck data-icon="inline-start" />
              {orderSetPrevious ? orderSetPrevious?.order_set : 0}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "order_calculate",
      header: "ຈຳນວນແນະນຳ",
      size: 100,
      cell: ({ row }) => {
        const orderRecommend = result.find(
          (item) => item?.bakery_detailId === row.original.id,
        );
        if (!orderRecommend) {
          return (
            <div className="font-medium text-green-600 text-xs">
              <Badge variant="secondary">
                <BadgeCheck data-icon="inline-start" />-
              </Badge>
            </div>
          );
        }
        return (
          <div className="font-medium">
            <Badge
              className={cn(
                "transition-colors",
                orderRecommend.highlight
                  ? "bg-green-600 hover:bg-green-700 text-white" // Green if true
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800", // Gray if false
              )}
            >
              <BadgeCheck data-icon="inline-start" />
              {orderRecommend.highlight
                ? `${orderRecommend.orderRec.toFixed(2)} (+${orderRecommend.valueadd})`
                : orderRecommend.orderRec.toFixed(2)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "order_send_L1",
      header: "ຍອດສົ່ງ L1",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-blue-600 text-xs">
            {orderL ? orderL.L1_Send : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_sell_L1",
      header: "ຍອດຂາຍ L1",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-green-600 text-xs">
            {orderL ? orderL.L1_Sell : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_exp_L1",
      header: "ຍອດໝົດອາຍຸ L1",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-red-600 text-xs">
            {orderL ? orderL.L1_Exp : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_send_L2",
      header: "ຍອດສົ່ງ L2",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-blue-600 text-xs">
            {orderL ? orderL.L2_Send : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_sell_L2",
      header: "ຍອດຂາຍ L2",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-green-600 text-xs">
            {orderL ? orderL.L2_Sell : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_exp_L2",
      header: "ຍອດໝົດອາຍຸ L2",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-red-600 text-xs">
            {orderL ? orderL.L2_Exp : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_send_L3",
      header: "ຍອດສົ່ງ L3",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-blue-600 text-xs">
            {orderL ? orderL.L3_Send : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_sell_L3",
      header: "ຍອດຂາຍ L3",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-green-600 text-xs">
            {orderL ? orderL.L3_Sell : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order_exp_L3",
      header: "ຍອດໝົດອາຍຸ L3",
      size: 100,
      cell: ({ row }) => {
        const orderL = historyMap[row.original.id];
        return (
          <div className="font-medium text-red-600 text-xs">
            {orderL ? orderL.L3_Exp : "-"}
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
    <div className="w-full overflow-x-auto rounded-md border bg-white font-lao">
      <Table className="min-w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                  className="h-10  text-left align-middle font-lao text-xs font-bold uppercase tracking-wider"
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
          {/* 1. CHECK LOADING STATE FIRST */}
          {loading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column, colIndex) => (
                  <TableCell key={`cell-${colIndex}`} className="text-center">
                    {/* We use a skeleton that mimics the height of your h-12 inputs */}
                    <Skeleton className="h-8 w-full rounded-md opacity-60" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length && value ? (
            // 2. RENDER ACTUAL ROWS
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // 3. RENDER EMPTY STATE
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາເພື່ອຄີອໍເດີເບເກີລີ້.
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

export default TableBakeryOrder;
