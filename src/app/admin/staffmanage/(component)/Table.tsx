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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import EditRoleStaff from "./EditRoleStaff";
import DeleteStaff from "./DeleteStaff";
import SuspendStaff from "./SuspendStaff";
import CheckPasswordStaff from "./CheckPasswordStaff";
import EditBranchStaff from "./EditBranchStaff";
import { Branch_type } from "../../tracksell/(component)/ParentTable";

interface DataTableProps {
  data: Staff_Office[];
  branchs: Branch_type[]
}

export type Staff_Office = {
  id: string;
  name: string;
  phonenumber: string;
  image?: string;
  role: string;
  available: boolean;
  branch: Branch_For_Staff;
};

type Branch_For_Staff = {
  id: number;
  name: string;
};

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: "ແອັດມິນ",
    className:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  },
  STAFF_SPC: {
    label: "ພະນັກງານຈັດຊຶ້",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  },
  STAFF_TK: {
    label: "ພະນັກງານທຮີຄອຟ",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
  },
  STAFF_WH: {
    label: "ພະນັກງານສາງ",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
  },
  BARISTAR: {
    label: "ບາເລສຕ້າ",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-red-100",
  },
};

export function DataTableCompo({ data,branchs }: DataTableProps) {
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

  const columns: ColumnDef<Staff_Office>[] = [
    {
      accessorKey: "image",
      header: "ຮູບພາບ",
      size: 80,
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string;
        const name = row.getValue("name") as string;

        return (
          <Avatar
            className="h-10 w-10 border cursor-zoom-in hover:opacity-80 transition-opacity"
            onClick={() => imageUrl && setSelectedViewImage(imageUrl)} // Set state on click
          >
            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "id",
      size: 120,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao text-[12px] font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ໄອດີພະນັກງານ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground w-20">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      size: 150,
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao text-[12px] font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ຊື່ພະນັກງານ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "phonenumber",
      header: "ເບີໂທລະສັບ",
      size: 120,
      cell: ({ row }) => (
        <div className="font-lao font-bold text-xs">
          020 {row.getValue("phonenumber")}
        </div>
      ),
    },
    {
      accessorKey: "role",

      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent font-lao text-[12px] font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ຕຳແໜ່ງ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      size: 120,
      cell: ({ row }) => {
        const roleKey = row.getValue("role") as string;
        const config = ROLE_CONFIG[roleKey] || {
          label: roleKey,
          className: "bg-gray-100",
        };

        return (
          <Badge
            variant="outline"
            className={`py-1 font-lao font-medium text-[11px] shadow-sm ${config.className}`}
          >
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "birthdate",
      header: "ວັດເດືອນປີເກີດ",
      size: 90,
      cell: ({ row }) => {
        const dateValue = row.getValue("birthdate") as string;
        if (!dateValue) return "---";

        const date = new Date(dateValue);
        return (
          <p className="font-lao text-xs">
            {new Intl.DateTimeFormat("en-GB").format(date)}
          </p>
        );
      },
    },
    {
      accessorKey: "available",
      header: "ສະຖານະ",
      size: 110,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`px-2 py-1 font-lao flex w-fit items-center gap-1 ${
            row.getValue("available")
              ? "text-green-600 border-green-200 bg-green-50"
              : "text-red-600 border-red-200 bg-red-50"
          }`}
        >
          {row.getValue("available") ? (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
              ປົກກະຕິ
            </>
          ) : (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
              ຫ້າມເຄື່ອນໄຫວ
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "branch.name",
      header: "ປະຈຳສາຂາ",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`px-2 py-1 font-lao flex w-fit items-center gap-1 border-gray-200 bg-green-50`}
        >
          <>
            <Store className="h-3.5 w-3.5" />
            {row.getValue("branch_name") || "ບໍ່ມີສາຂາ"}
          </>
        </Badge>
      ),
    },
    {
      id: "actions",
      size: 80,
      cell: ({ row }) => {
        const staff = row.original; // Get current row data

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

              {/* 1. Pass the staff data here */}
              <EditRoleStaff staff={staff} />

              <DropdownMenuSeparator />

              <EditBranchStaff staff={staff} branchs={branchs} />
              <DropdownMenuSeparator />

              {/* DELETE STAFF */}

              <DeleteStaff staff={staff} />

              <DropdownMenuSeparator />

              {/** SUSPEND USER */}

              <SuspendStaff staff={staff} />

              <DropdownMenuSeparator />

              {/**PASSWORD STAFF */}

              <CheckPasswordStaff staff={staff} />
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
    getPaginationRowModel: getPaginationRowModel(), // Required for client-side pagination
    onPaginationChange: setPagination, // Updates state when clicking buttons
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
              placeholder="ຄົ້ນຫາຊື່ພະນັກງານ..."
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
                // If "all" is selected, we clear the filter by sending an empty string
                // Otherwise, we send the specific role value
                table
                  .getColumn("role")
                  ?.setFilterValue(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-50 h-10! border-slate-200 py-2 bg-secondary">
                <SelectValue placeholder="ທັງໝົດ" />
              </SelectTrigger>
              <SelectContent className="font-lao">
                <SelectGroup>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="admin">ແອັດມິນ</SelectItem>
                  <SelectItem value="STAFF_SPC">ພະນັກງານຈັດຊື້</SelectItem>
                  <SelectItem value="STAFF_TK">ພະນັກງານທຮີຄອຟ</SelectItem>
                  <SelectItem value="STAFF_WH">ພະນັກງານສາງ</SelectItem>
                  <SelectItem value="BARISTAR">ບາເລສຕ້າ</SelectItem>
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
          ພະນັກງານທັງໝົດ {table.getFilteredRowModel().rows.length} ຄົນ
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
}
