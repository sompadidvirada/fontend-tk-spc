import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
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
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import { Stock_Remain } from "./ParentCompo";

// Interface based on your requested JSON response structure
interface Prop {
  selectedDate: DateRange | undefined;
  loading: boolean;
  value: string;
  check: Stock_Remain[];
  fecthStockRemain: any;
  data: Report_Stock[];
  branch: Branch_type[];
}

type All_Stock_Requisition = {
  id: number;
  variant_name: string;
  total_price_kip: number;
  total_price_bath: number;
  barcode: string;
  quantity_requisition: number;
};

type Supplyer = {
  address: string | null;
  category: string | null;
  contact_name: string;
  createdAt: string;
  id: number;
  image: string;
  name: string;
  phone: string | null;
  rating: number | null;
  updatedAt: string;
};

interface Report_Stock {
  id: number;
  material_name: string;
  description: string;
  category_materialId: number;
  category_name: string;
  image: string;
  min_order: number;

  supplyer: Supplyer;
  all_stockrequisition: All_Stock_Requisition[];
}
import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";
import EditStockDialog from "./EditStockDialog";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectedVariants: Record<string, number>; // or whatever your type is
    onOpenEditStock: (data: {
      id: number;
      materialId: number;
      variantId: number;
      conver_to_base: number;
      currentStock: number;
      materialName: string;
      variantName?: string;
    }) => void;
  }
}

const MaterialReportTable = ({
  selectedDate,
  loading,
  value,
  check,
  data,
  branch,
  fecthStockRemain,
}: Prop) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const countBranch = branch?.length;

  const startDate = new Date(selectedDate?.from ?? new Date());
  const endDate = new Date(selectedDate?.to ?? new Date());
  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, number>
  >({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  // Do this once before rendering the table
  const stockLookup = Object.fromEntries(
    check.map((material) => [
      material.id,
      Object.fromEntries(
        material.all_stock.map((variant) => [variant.id, variant]),
      ),
    ]),
  );

  console.log(data);

  // Then in your cell:

  const columns: ColumnDef<Report_Stock>[] = [
    {
      accessorKey: "image",
      size: 120,
      header: "ຮູບພາບ",
      cell: ({ row }) => {
        const imageUrl =
          (row.getValue("image") as string) || "/images/login-bg.jpg";
        return (
          <div
            onClick={() => setSelectedViewImage(imageUrl)}
            className="relative cursor-zoom-in h-12 w-12 overflow-hidden rounded-md border border-gray-200"
          >
            <Image
              src={imageUrl}
              sizes="xs"
              alt={"product image"}
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
      size: 120,
      cell: ({ row, table }) => {
        const variants = row.original.all_stockrequisition;

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
      size: 80,
      header: "ລາຍການ",
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];
        const name = row.getValue("name") as string;
        return (
          <div className="font-medium text-[11px]">
            {name} {variant.variant_name}
          </div>
        );
      },
    },
    {
      accessorKey: "category_name",
      size: 160,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold"
        >
          ໝວດໝູ່ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("category_name") as string;
        return <div className="font-medium text-[11px]">{name}</div>;
      },
    },
   
    {
      accessorKey: "quantity_requisition",
      header: "ຈຳນວນການເບີກ",
      size: 160,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];

        return (
          <div className="font-medium text-xs text-blue-600">
            {variant?.quantity_requisition.toLocaleString()}{" "}
            {`(${variant?.variant_name})`}
          </div>
        );
      },
    },
    {
      accessorKey: "requisition_perday",
      header: "ຍອດເບີກສະເລ່ຍຕໍ່ມື້",
      size: 160,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];

        return (
          <div className="font-medium text-xs text-blue-500">
            {(variant?.quantity_requisition / diffInDays).toLocaleString()}{" "}
            {`(${variant?.variant_name}) / ມື້`}
          </div>
        );
      },
    },
    {
      accessorKey: "requisition_permonth",
      header: "ຍອດເບີກສະເລ່ຍຕໍ່ເດືອນ",
      size: 160,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];

        return (
          <div className="font-medium text-xs text-blue-500">
            {(
              (variant?.quantity_requisition / diffInDays) *
              30
            ).toLocaleString()}{" "}
            {`(${variant?.variant_name}) / ເດືອນ`}
          </div>
        );
      },
    },
    {
      accessorKey: "requisition_perbranch",
      header: "ຍອດເບີກສະເລ່ຍຕໍ່ສາຂາ",
      size: 160,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];

        return (
          <div className="font-medium text-xs text-blue-600">
            {(
              ((variant?.quantity_requisition / diffInDays) * 30) /
              countBranch
            ).toLocaleString()}{" "}
            {`(${variant?.variant_name}) / ເດືອນ / ສາຂາ`}
          </div>
        );
      },
    },
    {
      accessorKey: "stock_remain",
      header: "ສະຕ໋ອກຄົງເຫຼືອ",
      size: 160,
      cell: ({ row, table }) => {
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];
        const variantId =
          selectedId || row.original.all_stockrequisition[0]?.id;
        const stockData = stockLookup[row.original.id]?.[variantId];

        return (
          <div
            onClick={() =>
              table.options.meta?.onOpenEditStock({
                id: stockData.stock_id,
                materialId: row.original.id,
                variantId: variantId,
                conver_to_base: stockData.conver_to_base,
                currentStock: stockData?.stock_remain || 0,
                materialName: row.original.material_name,
                variantName: stockData?.variant_name,
              })
            }
            className="font-medium text-xs text-green-600 cursor-pointer hover:bg-green-50 p-1 rounded transition-colors border border-transparent hover:border-green-200"
            title="ຄລິກເພື່ອແກ້ໄຂສະຕ໋ອກ"
          >
            {stockData ? (
              <>
                {stockData.stock_remain.toLocaleString()}{" "}
                {`(${stockData.variant_name})`}
              </>
            ) : (
              "0 (ບໍ່ມີຂໍ້ມູນ)"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "stokc_remian_use",
      header: "ຍອດທີສາມາດນຳໃຊ້ໄດ້",
      size: 160,
      cell: ({ row, table }) => {
        const min_order = row.getValue("min_order") as number;
        const selectedId = table.options.meta?.selectedVariants[row.id];
        const variantId =
          selectedId || row.original.all_stockrequisition[0]?.id;
        const variant =
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];
        const stock_remain_material =
          stockLookup[row.original.id]?.[variantId] || 0;
        const use_per_day = variant?.quantity_requisition / diffInDays;

        const stock_remain_use =
          stock_remain_material.stock_remain / use_per_day;

        return (
          <div className="flex flex-col gap-2">
            <div className="font-medium text-xs text-blue-600">{`${stock_remain_use.toLocaleString()} ວັນ`}</div>
            <div className="font-medium text-xs">
              {stock_remain_use > min_order ? (
                <span className="text-green-600">
                  {`+ ${(stock_remain_use - min_order).toFixed(2)} ມື້`}
                </span>
              ) : (
                <span className="text-red-600">
                  {`${(stock_remain_use - min_order).toFixed(2)} ມື້`}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "min_order",
      size: 180,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold"
        >
          ສະຕ໋ອກຂັ້ນຕ່ຳ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("min_order") as string;
        return <div className="font-medium text-[11px] px-3">{name}</div>;
      },
    },
     {
      accessorKey: "supplyer",
      sortingFn: (rowA, rowB) => {
        const nameA = rowA.original.supplyer?.name ?? "";
        const nameB = rowB.original.supplyer?.name ?? "";
        return nameA.localeCompare(nameB);
      },
      size: 200,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold"
        >
          ບໍລິສັດ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        // Access the supplier object
        const supplier = row.getValue("supplyer") as {
          name: string;
          category: string;
          image: string;
        } | null;

        if (!supplier) {
          return (
            <div className="text-slate-400 italic text-[11px]">No Supplier</div>
          );
        }

        return (
          <div className="flex items-center gap-3 w-full">
            {/* Supplier Image */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200">
              {supplier.image ? (
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] text-slate-400">
                  No Img
                </div>
              )}
            </div>

            {/* Supplier Info */}
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[12px] text-slate-700 whitespace-normal break-words leading-tight">
                {supplier.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {supplier.category}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "stock_recommend",
      header: "ຈຳນວນທີຄວນສັ່ງ",
      size: 160,
      cell: ({ row, table }) => {
        const min_order = row.getValue("min_order") as number;
        const selectedId = table.options.meta?.selectedVariants[row.id];

        const variantId =
          selectedId || row.original.all_stockrequisition[0]?.id;

        const variant =
          row.original.all_stockrequisition.find((v) => v.id === variantId) ||
          row.original.all_stockrequisition[0];
        const stockObject = stockLookup[row.original.id]?.[variantId];
        const currentStock = stockObject?.stock_remain || 0;
        const use_per_day = (variant?.quantity_requisition || 0) / diffInDays;

        const stokc_leave_to_use = currentStock / use_per_day;

        const deficit = stokc_leave_to_use - min_order;
        const leadTimeBuffer = Math.abs(deficit) + 8;

        let stock_to_order_recommend = use_per_day * leadTimeBuffer;

        if (stokc_leave_to_use > min_order) {
          stock_to_order_recommend = 0;
        }

        return (
          <div
            className={`font-medium text-xs ${stock_to_order_recommend > 0 ? "text-red-600" : "text-gray-400"}`}
          >
            {stock_to_order_recommend > 0
              ? `${stock_to_order_recommend.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })} (${variant.variant_name})`
              : "ພຽງພໍແລ້ວ"}
          </div>
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
          row.original.all_stockrequisition.find((v) => v.id === selectedId) ||
          row.original.all_stockrequisition[0];

        return (
          <div className="flex flex-col gap-2">
            <div className="font-medium text-xs">
              {variant?.total_price_kip.toLocaleString()} ₭
            </div>
            <div className="font-medium text-xs">
              {variant?.total_price_bath.toLocaleString()} ฿
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
      onOpenEditStock: (payload) => {
        setIsDialogOpen(true);
        setSelectedStock(payload);
      },
    },
  });

  return (
    <div className="w-full overflow-x-auto rounded-md border bg-white font-lao">
      {loading ? (
        <div className="w-full h-30 items-center">
          <Spinner />
        </div>
      ) : (
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
      {
        <EditStockDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          data={selectedStock}
          fecthStockRemain={fecthStockRemain}
        />
      }

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

export default MaterialReportTable;
