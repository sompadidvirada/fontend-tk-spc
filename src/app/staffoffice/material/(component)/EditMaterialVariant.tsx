"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Database, Calculator, Loader2 } from "lucide-react";
import {
  createMaterialVariant,
  deleteMaterialVariant,
  updateRelationVariant,
} from "@/app/api/client/material";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const EditMaterialVariant = ({ material, isOpen, onClose, onSuccess }: any) => {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (material?.material_variant) {
      const sortedVariants = [...material.material_variant].sort(
        (a, b) => (a.conver_to_base || 0) - (b.conver_to_base || 0),
      );
      setVariants(sortedVariants);
    }
  }, [material, isOpen]);

  const handleChange = (index: number, field: string, value: any) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      let finalValue = value;

      // Convert numeric fields
      const numericFields = [
        "parent_variantId",
        "quantity_in_parent",
        "price_kip",
        "sell_price_kip",
        "price_bath",
        "sell_price_bath",
      ];
      if (numericFields.includes(field)) {
        finalValue = value === "" ? null : Number(value);
      }

      // Update the specific field
      newVariants[index] = { ...newVariants[index], [field]: finalValue };

      // If we changed a relationship field, trigger the chain reaction calculation
      if (field === "parent_variantId" || field === "quantity_in_parent") {
        return calculateBaseTotals(newVariants);
      }

      return newVariants;
    });
  };
  const createNewRow = async () => {
    setLoading(true);
    try {
      const ress = await createMaterialVariant({ materialId: material.id });

      const newVariantFromDB = ress.data;
      setVariants((prev) => [...prev, newVariantFromDB]);
    } catch (err) {
      console.error("Error creating row:", err);
      toast.error("ບໍ່ສາມາດສ້າງແຖວໃໝ່ໄດ້");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateRelationVariant(variants);
      onClose();
      toast.success("ອັປເດດສຳເລັດ");
      router.refresh();
    } catch (err) {
      console.error("API Error:", err);
      alert("ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້");
    }
  };

  const deleteVariant = async (id: number, index: number) => {
    if (!id) {
      // If it's a local-only row (shouldn't happen in this flow)
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    if (!confirm("ທ່ານຕ້ອງການລຶບຫົວໜ່ວຍນີ້ບໍ?")) return;

    try {
      await deleteMaterialVariant(id);
      setVariants(variants.filter((v) => v.id !== id));
    } catch (err) {
      alert("ລຶບບໍ່ສຳເລັດ");
    }
  };

  const calculateBaseTotals = (allVariants: any[]) => {
    // 1. Map to store calculated values for quick lookup
    const baseTotals: Record<number, number> = {};

    // 2. We need a helper function to find the total for a specific ID
    const getBaseTotal = (variant: any): number => {
      // If it's already calculated, return it
      if (variant.id && baseTotals[variant.id]) return baseTotals[variant.id];

      // If no parent or parent ID is null, it IS a base unit (Total = 1)
      if (!variant.parent_variantId) {
        if (variant.id) baseTotals[variant.id] = 1;
        return 1;
      }

      // Find the parent object in the current list
      const parent = allVariants.find((v) => v.id === variant.parent_variantId);

      // If parent exists, Total = (Parent's Base Total) * (Qty in Parent)
      if (parent) {
        const parentTotal = getBaseTotal(parent); // Recursive call
        const total = parentTotal * (variant.quantity_in_parent || 0);
        if (variant.id) baseTotals[variant.id] = total;
        return total;
      }

      return 1; // Fallback
    };

    // 3. Return a new array with updated conver_to_base for every row
    return allVariants.map((v) => ({
      ...v,
      conver_to_base: getBaseTotal(v),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[95vw] max-h-[90vh] overflow-y-auto font-lao">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-6 w-6 text-indigo-600" />
            ຈັດການ Variant: {material?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border w-40">ຊື່ຫົວໜ່ວຍ</th>
                  <th className="p-2 border w-40">ບາໂຄດ</th>
                  <th className="p-2 border text-blue-700 bg-blue-50/50">
                    Parent ID
                  </th>

                  <th className="p-2 border text-orange-700 bg-orange-50/50">
                    Qty/Parent
                  </th>
                  <th className="p-2 border">Base Total</th>
                  <th className="p-2 border">KIP (Cost/Sell)</th>
                  <th className="p-2 border">THB (Cost/Sell)</th>
                  <th className="p-2 border text-center">ລຶບ</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, index) => (
                  <tr key={v.id} className="hover:bg-slate-50 border-b">
                    <td className="p-2 border text-center font-mono font-bold text-indigo-600 bg-indigo-50/20">
                      {v.id}
                    </td>
                    <td className="p-2 border">
                      <Input
                        className="h-8"
                        value={v.variant_name}
                        onChange={(e) =>
                          handleChange(index, "variant_name", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border bg-purple-50/10">
                      <Input
                        className="h-8 border-purple-200 focus:border-purple-500"
                        value={v.barcode || ""}
                        onChange={(e) =>
                          handleChange(index, "barcode", e.target.value)
                        }
                        placeholder="Scan or Type..."
                      />
                    </td>
                    <td className="p-2 border bg-blue-50/20">
                      <Input
                        type="number"
                        className="h-8 border-blue-300"
                        value={v.parent_variantId ?? ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "parent_variantId",
                            e.target.value,
                          )
                        }
                        placeholder="ID"
                      />
                    </td>

                    <td className="p-2 border bg-orange-50/20">
                      <Input
                        type="number"
                        className="h-8 border-orange-300"
                        value={v.quantity_in_parent ?? ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "quantity_in_parent",
                            e.target.value,
                          )
                        }
                        placeholder="Qty"
                      />
                    </td>
                    <td className="p-2 border">
                      <Input
                        type="number"
                        className="h-8 w-20"
                        value={v.conver_to_base}
                        onChange={(e) =>
                          handleChange(index, "conver_to_base", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          className="h-8"
                          value={v.price_kip}
                          onChange={(e) =>
                            handleChange(index, "price_kip", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          className="h-8 font-bold"
                          value={v.sell_price_kip}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "sell_price_kip",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          className="h-8"
                          value={v.price_bath}
                          onChange={(e) =>
                            handleChange(index, "price_bath", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          className="h-8 font-bold"
                          value={v.sell_price_bath}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "sell_price_bath",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="p-2 border text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => deleteVariant(v.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            type="button"
            disabled={loading}
            onClick={createNewRow}
            className="w-full py-6 border-2 border-dashed border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Plus className="mr-2" />
            )}
            ສ້າງຫົວໜ່ວຍໃໝ່ລົງ Database ທັນທີ (Get New ID First)
          </Button>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              ຍົກເລີກ
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-10"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                "ອັບເດດການພົວພັນທັງໝົດ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaterialVariant;
