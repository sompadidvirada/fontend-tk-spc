import { Button } from "@/components/ui/button";
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
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface DataProps {
  data: BakeryData[];
}

export interface BakeryData {
  id: number;
  name: string;
  category: string;
  percentExp: number;
  sell: { qty: number; total_cost: number; total_revenue: number };
  send: { qty: number; total_cost: number; total_revenue: number };
  exp: { qty: number; total_cost: number; total_revenue: number };
  image?: string; // Optional if not in API yet
}

const TableReport = ({ data }: DataProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const columns: ColumnDef<BakeryData>[] = [
    {
      accessorKey: "image",
      size: 80,
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
          className="text-xs"
        >
          ລາຍການ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="font-medium text-[11px] leading-tight break-words max-w-[150px] whitespace-normal">
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs"
        >
          ຕົ້ນທຶນ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size:120,
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
      size: 120,
      cell: ({ row }) => {
        const sellPrice = parseFloat(row.getValue("sell_price"));
        return (
          <div className="font-medium text-green-600 text-xs">
            {formatCurrency(sellPrice)} ₭
          </div>
        );
      },
    },
    {
      id: "send_qty",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs"
        >
          ຈຳນວນສົ່ງ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 100,
      accessorFn: (row) => row.send.qty,
      cell: ({ getValue }) => (
        <div className="text-xs">{getValue() as number}</div>
      ),
    },
    {
      id: "sold_qty",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs"
        >
          ຈຳນວນຂາຍ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size:100,
      accessorFn: (row) => row.sell.qty,
      cell: ({ getValue }) => (
        <div className="text-xs">{getValue() as number}</div>
      ),
    },
    {
      id: "exp_qty",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs"
        >
          ຈຳນວນໝົດອາຍຸ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 100,
      accessorFn: (row) => row.exp.qty,
      cell: ({ getValue }) => (
        <div className="text-xs">{getValue() as number}</div>
      ),
    },
    {
      accessorKey: "percentExp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs"
        >
          % ສູນເສຍ <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size:80,
      cell: ({ row }) => (
        <div className="text-xs text-red-500 font-bold">
          {row.original.percentExp}%
        </div>
      ),
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
          {table.getRowModel().rows?.length ? (
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
                ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາເພື່ອເບີ່ງຂໍ້ມູນລາຍງານເບເກີລີ້.
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

export default TableReport;
