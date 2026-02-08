"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Search,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import EditBakery from "./EditBakery";
import ChangeStatus from "./ChangeStatus";
import EditStatufSellPerBranch from "./EditStatufSellPerBranch";
import DeleteBakery from "./DeleteBakery";

interface DataTableProps {
  data: Bakery_Detail[];
  categoryBakery: Category_Bakery[];
  supplyer: Supplyer[]
}

export type Supplyer = {
  id: number;
  name: string;
  order_range: number;
};

export type Bakery_Detail = {
  id: number;
  name: string;
  price: number;
  sell_price?: number;
  supplyer_bakeryId?: number;
  supplyer_bakery: Supplyer;
  bakeryCategory: {
    id: number;
    name: string;
  };
  image: string | null;
  status: string;
};
export type Category_Bakery = {
  id: number;
  name: string;
};

const TableBakery = ({ data, categoryBakery,supplyer }: DataTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns: ColumnDef<Bakery_Detail>[] = [
    {
      accessorKey: "image",
      header: "ຮູບພາບ",
      size: 50,
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
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ຊື່ເບເມນູ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium font-lao">{row.getValue("name")}</div>
      ),
    },
    {
      id: "categoryName",
      accessorFn: (row) => row.bakeryCategory.name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ໝວດໝູ່
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 90,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="px-2 py-1 font-lao flex w-fit items-center gap-1 border-gray-200 bg-green-50"
        >
          {/* getValue will now return the category name string */}
          {row.getValue("categoryName")}
        </Badge>
      ),
    },
    {
      id: "supplyerName",
      accessorFn: (row) => row.supplyer_bakery?.name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ຊື່ບໍລິສັັດ/ຮ້ານ
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      size: 90,
      cell: ({ row }) => {
        const supplyer = row.getValue<string>("supplyerName");

        if (!supplyer) return (
          <Badge
            variant="outline"
            className="px-2 py-1 font-lao flex w-fit items-center gap-1 border-gray-200"
          >
            ຍັງບໍ່ໄດ້ເລືອກບໍລິສັດ
          </Badge>
        );

        return (
          <Badge
            variant="outline"
            className="px-2 py-1 font-lao flex w-fit items-center gap-1 border-gray-200 bg-green-100"
          >
            {supplyer}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ລາຄາຕົ້ນທຶນ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 90,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return (
          <div className="font-lao font-bold text-xs">
            {new Intl.NumberFormat("en-US").format(price)} ກີບ
          </div>
        );
      },
    },
    {
      accessorKey: "sell_price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ລາຄາຂາຍ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 90,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("sell_price"));
        return (
          <div className="font-lao font-bold text-xs">
            {new Intl.NumberFormat("en-US").format(price)} ກີບ
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ສະຖານະຍອດຂາຍ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 91,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`px-2 py-1 font-lao flex w-fit items-center gap-1 border-gray-200 bg-green-50`}
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "ຈັດການ",
      cell: ({ row }) => {
        const bakery_selected = row.original; // Get current row data
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-lao font-bold">
                ແກ້ໄຂ
              </DropdownMenuLabel>

              {/**EDIT BAKERY */}

              <EditBakery
                bakery_selected={bakery_selected}
                categoryBakery={categoryBakery}
                supplyer={supplyer}
              />

              {/** CHANGE STATUS BAKERY */}

              <ChangeStatus bakery_selected={bakery_selected} />

              {/*MANAGE BAEKERY SEND PER BRANCH */}

              <EditStatufSellPerBranch bakery_selected={bakery_selected} />

              {/** DELETE THE BAKERY */}

              <DeleteBakery bakery_selected={bakery_selected} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Starts at 0
    pageSize: 10, // Shows 10 rows per page
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, 
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <Input
              placeholder="ຄົ້ນຫາຊື່ລາຍການເບເກີລີ້..."
              className="pl-9 w-full h-10 border border-slate-200 focus-visible:ring-1 font-lao bg-secondary"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="font-lao">
            <Select
              onValueChange={(value) => {
                table
                  .getColumn("categoryName")
                  ?.setFilterValue(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-50 h-10 border-slate-200 py-2 bg-secondary font-lao">
                <SelectValue placeholder="ເລືອກໝວດໝູ່" />
              </SelectTrigger>
              <SelectContent className="font-lao">
                <SelectGroup>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  {categoryBakery?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* RESPONSIVE WRAPPER */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          {/* This enables horizontal scroll on mobile */}
          <Table className="min-w-200 table-fixed">
            {/* Prevents the table from squishing too much */}
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-10 px-4 text-left align-middle font-lao text-xs font-bold uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle"
                      >
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination: Responsive footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1 font-lao">
          ຈຳນວນເບເກີລີທັງໝົດ {table.getFilteredRowModel().rows.length} ຄົນ
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1 font-lao">
            ສະແດງ {table.getState().pagination.pageIndex + 1} ຈາກ{" "}
            {table.getPageCount()} ໜ້າ (
            {table.getFilteredRowModel().rows.length} ລາຍການທັງໝົດ)
          </div>

          <div className="flex items-center space-x-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

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

export default TableBakery;
