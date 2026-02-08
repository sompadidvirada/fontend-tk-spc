"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Edit,
  MoreHorizontal,
  Building2,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category_Material, Material } from "../page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import EditMaterial from "./EditMaterial";
import EditMaterialVariant from "./EditMaterialVariant";
import { Supplyer_Spc } from "./DetailSupplyer";

interface Prop {
  materials: Material[];
  category: Category_Material[];
  supplyer_spc: Supplyer_Spc[];
}
const ITEMS_PER_PAGE = 10;

const TableMaterial = ({ materials, category, supplyer_spc }: Prop) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditOpen2, setIsEditOpen2] = useState(false);
  const [editingMaterialVariant, setEditingMaterialVariant] =
    useState<Material | null>(null);
  const filteredMaterials = materials?.filter((item) => {
    if (!item.category_materialId) return;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      item.category_materialId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(
    (filteredMaterials?.length || 0) / ITEMS_PER_PAGE,
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredMaterials?.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  const handleFilterChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handleEdit = (item: Material) => {
    setEditingMaterial(item); // Set the specific item data
    setIsEditOpen(true); // Open the modal
  };
  const handleEdit2 = (item: Material) => {
    setEditingMaterialVariant(item); // Set the specific item data
    setIsEditOpen2(true); // Open the modal
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ຄົ້ນຫາວັດຖຸດິບ..."
              className="pl-9 font-lao bg-secondary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select value={categoryFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[200px] font-lao bg-secondary">
              <SelectValue placeholder="ເລືອກໝວດໝູ່" />
            </SelectTrigger>
            <SelectContent className="font-lao">
              <SelectItem value="all">ທັງໝົດ</SelectItem>
              {category?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* The Edit Dialog Component */}
      {editingMaterial && (
        <EditMaterial
          material={editingMaterial}
          isOpen={isEditOpen}
          category={category}
          supplyer_spc={supplyer_spc}
          onClose={() => {
            setIsEditOpen(false);
            setEditingMaterial(null);
          }}
          onSuccess={() => {
            // Trigger your parent fetch logic here (e.g., refresh data)
            console.log("Updated successfully!");
          }}
        />
      )}
      {editingMaterialVariant && (
        <EditMaterialVariant
          material={editingMaterialVariant}
          isOpen={isEditOpen2}
          onClose={() => {
            setIsEditOpen2(false);
            setEditingMaterialVariant(null);
          }}
          onSuccess={() => {
            console.log("Updated successfully!");
          }}
        />
      )}

      {/* Table Section */}
      <div className="rounded-md border bg-white overflow-hidden font-lao">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px]">ຮູບ</TableHead>
              <TableHead>ລາຍລະອຽດວັດຖຸດິບ</TableHead>
              <TableHead>ລາຍລະອຽດຫົວໜ່ວຍ</TableHead>
              <TableHead>ບໍລິສັດສະໜອງສິນຄ້າ</TableHead>
              <TableHead className="text-right">ລາຄາ (Base Unit)</TableHead>
              <TableHead className="text-right">ຈັດການ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData?.length ? (
              paginatedData.map((material) => {
                const baseVariant = material.material_variant.find(
                  (v) => v.conver_to_base === 1,
                );
                return (
                  <TableRow key={material.id}>
                    <TableCell>
                      <img
                        src={material.image}
                        className="h-12 w-12 rounded-md object-cover border"
                        alt={material.name}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {material.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {material.category_material.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="w-fit mt-1 text-[10px] text-orange-600 border-orange-200"
                        >
                          Min Order: {material.min_order}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {/* Visualizing the Relation Path */}
                        <div className="flex items-center gap-1">
                          {material.material_variant
                            .sort((a, b) => b.conver_to_base - a.conver_to_base)
                            .map((v, index, array) => (
                              <React.Fragment key={v.id}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge
                                        variant={
                                          v.conver_to_base === 1
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-[11px] font-lao"
                                      >
                                        {v.variant_name}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs font-lao">
                                        ບາໂຄດ: {v.barcode}
                                      </p>
                                      <p className="text-xs font-lao">
                                        1 {v.variant_name} = {v.conver_to_base}{" "}
                                        Base Units
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {index < array.length - 1 && (
                                  <span className="text-muted-foreground text-xs">
                                    →
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {material.supplierSpc ? (
                        <div className="flex items-center gap-2">
                          {/* Supplier Image */}
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                            {material.supplierSpc.image ? (
                              <img
                                src={material.supplierSpc.image}
                                alt={material.supplierSpc.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-full w-full p-2 text-slate-400" />
                            )}
                          </div>

                          {/* Supplier Name & Category */}
                          <div className="flex flex-col">
                            <span className="text-xs font-bold leading-none">
                              {material.supplierSpc.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1">
                              {material.supplierSpc.category || "General"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 opacity-50">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserX size={14} className="text-slate-400" />
                          </div>
                          <span className="text-xs italic text-slate-400">
                            ບໍ່ມີຂໍ້ມູນຜູ້ສະໜອງ
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-700">
                          {baseVariant?.sell_price_kip?.toLocaleString()} ກີບ
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {baseVariant?.sell_price_bath?.toLocaleString()} ບາດ
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-lao">
                          <DropdownMenuLabel>ຕົວເລືອກ</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEdit(material)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />
                            ແກ້ໄຂຂໍ້ມູນວັດຖຸດິບ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEdit2(material)}
                          >
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />
                            ແກ້ໄຂບັນຈຸພັນວັດຖຸດິບ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  ບໍ່ພົບຂໍ້ມູນ.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 font-lao">
        <div className="text-sm text-muted-foreground">
          ສະແດງ {startIndex + 1} ຫາ{" "}
          {Math.min(
            startIndex + ITEMS_PER_PAGE,
            filteredMaterials?.length || 0,
          )}{" "}
          ຈາກ {filteredMaterials?.length} ລາຍການ
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ກັບຄືນ
          </Button>
          <div className="text-sm font-medium">
            ໜ້າ {currentPage} ຈາກ {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            ຖັດໄປ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableMaterial;
