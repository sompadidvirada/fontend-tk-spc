"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Material } from "../../material/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteStockRequisition,
  getAllStockRequisition,
  insertStockRequisition,
} from "@/app/api/client/stock_requisition";
import EditRequisition from "./EditRequisition";
import { Spinner } from "@/components/ui/spinner";

export type Stock_Requisition = {
  id: number;
  quantity: number;
  branchId: number;
  material_variantId: number;
};

export type Form_Insert = {
  material_variantId: number;
  quantity: number;
  base_quantity: number;
  price_kip: number;
  sell_price_kip: number;
  price_bath: number;
  sell_price_bath: number;
  date: string;
  branchId: number;
};

interface MaterialProp {
  selectedDate: Date | undefined;
  data: Material[];
  value: string;
  loading: boolean
  check: Stock_Requisition[]
  setCheck: React.Dispatch<React.SetStateAction<Stock_Requisition[]>>
}
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectedVariants: Record<string, number>;
    updateVariant: (rowId: string, variantId: number) => void;
  }
}

const TableMaterial = ({ selectedDate, data, value, loading, check, setCheck }: MaterialProp) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };
  const dateToSend = selectedDate?.toLocaleDateString("en-CA");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, number>
  >({});
  const [isPending, startTransition] = useTransition();

  const handleInsertStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dateToSend) return toast.error("ກະລຸນາເລືອກວັນທີກ່ອນ.");
    const form = e.currentTarget;
    const formData = new FormData(form);

    const dataToApi: Form_Insert = {
      material_variantId: Number(formData.get("material_variantId")),
      date: dateToSend,
      branchId: Number(value),
      quantity: Number(formData.get("quantity")),
      base_quantity: Number(formData.get("base_quantity")),
      price_kip: Number(formData.get("price_kip")),
      sell_price_kip: Number(formData.get("sell_price_kip")),
      price_bath: Number(formData.get("price_bath")),
      sell_price_bath: Number(formData.get("sell_price_bath")),
    };
    try {
      const ress = await insertStockRequisition(dataToApi);
      setCheck((prev) => [...prev, ress.data]);
    } catch (err) {
      console.log(err);
    }
  };



  const deleteStock = async (id: number) => {
    startTransition(async () => {
      try {
        const ress = await deleteStockRequisition(id);
        toast.success("ລົບລາຍການສຳເລັດ.");
        setCheck((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.log(err);
      }
    });
  };



  const columns: ColumnDef<Material>[] = [
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
      accessorKey: "material_variant",
      header: "ເລືອກແພັກໄຊ້",
      size: 80,
      cell: ({ row, table }) => {
        const variants = row.original.material_variant;

        // 1. Get the current selected ID from the global table state (meta)
        // If nothing is selected yet, default to the first variant's ID
        const selectedId =
          table.options.meta?.selectedVariants[row.id] || variants[0]?.id;

        return (
          <div className="flex flex-col gap-1">
            <select
              className="text-[11px] border rounded p-1 bg-white"
              value={selectedId}
              // 2. Update the GLOBAL state so other columns see the change
              onChange={(e) => {
                const newId = Number(e.target.value);
                table.options.meta?.updateVariant(row.id, newId);
              }}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.variant_name}
                </option>
              ))}
            </select>
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
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.material_variant.find((v) => v.id === selectedId) ||
          row.original.material_variant[0];
        const name = row.getValue("name") as string;
        return (
          <div className="font-medium text-[11px]">
            {name} {variant.variant_name}
          </div>
        );
      },
    },
    {
      id: "input_action",
      header: "ປ້ອນຈຳນວນ",
      size: 90,
      cell: ({ row }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.material_variant.find((v) => v.id === selectedId) ||
          row.original.material_variant[0];
        const existingEntry = check.find(
          (item) => item.material_variantId === variant.id,
        );

        if (existingEntry) {
          return (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-24 font-bold text-blue-600">
                ຍອດທີ່ບັນທືກ. ({existingEntry.quantity})
              </span>
              <EditRequisition
                id={existingEntry.id}
                setCheck={setCheck}
                variant={variant}
              />
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => deleteStock(existingEntry.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        }

        // STATE B: No data - Show the Form (Input + Save)
        return (
          <form
            className="flex items-center gap-2"
            onSubmit={handleInsertStock}
          >
            <input type="hidden" name="material_variantId" value={variant.id} />
            <input type="hidden" name="price_kip" value={variant.price_kip} />
            <input
              type="hidden"
              name="sell_price_kip"
              value={variant.sell_price_kip}
            />
            <input type="hidden" name="price_bath" value={variant.price_bath} />
            <input
              type="hidden"
              name="sell_price_bath"
              value={variant.sell_price_bath}
            />
            <input
              type="hidden"
              name="base_quantity"
              value={variant.conver_to_base}
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
      header: "ຕົ້ນທຶນ",
      size: 100,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.material_variant.find((v) => v.id === selectedId) ||
          row.original.material_variant[0];

        return (
          <div className="flex flex-col gap-2">
            <div className="font-medium text-xs">
              {variant?.price_kip.toLocaleString()} ₭
            </div>
            <div className="font-medium text-xs">
              {variant?.price_bath.toLocaleString()} ฿
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sell_price",
      header: "ລາຄາຂາຍ",
      size: 100,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variants = row.original.material_variant;
        const variant =
          variants.find((v) => v.id === selectedId) || variants[0];

        return (
          <div className="flex flex-col gap-2">
            <div className="font-medium text-green-600 text-xs">
              {formatCurrency(variant?.sell_price_kip || 0)} ₭
            </div>
            <div className="font-medium text-xs text-green-600">
              {variant?.sell_price_bath.toLocaleString()} ฿
            </div>
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
    meta: {
      selectedVariants,
      updateVariant: (rowId, variantId) => {
        setSelectedVariants((prev) => ({ ...prev, [rowId]: variantId }));
      },
      onOpenEditStock: (someValue) => {
       // your logic here
    },
    },
  });

  return (
    <div className="rounded-md border font-lao bg-white">
      {loading ? (
        <div className="w-full h-30 items-center">
          <Spinner />
        </div>
      ) : (
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາເພື່ອຄີຂໍ້ມູນຍອດຂາຍ.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/**DIALOG IMAGE PREVIEW */}
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

export default TableMaterial;
