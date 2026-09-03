import { createCalendarOrderSpc } from "@/app/api/client/calendar_order";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, FileText, Plus, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Supplyer_Spc } from "../../material/(component)/DetailSupplyer";

// --- TYPES matching your database response ---
interface MaterialVariant {
  id: number;
  materialId: number;
  image: string;
  variant_name: string;
  conver_to_base: number;
  barcode?: string | null;
  price_kip?: number | null;
  price_bath?: number | null;
  parent_variantId?: number | null;
}

export interface Material {
  id: number;
  name: string;
  image?: string;
  supplier_spcId?: string | null;
  min_order?: number;
  material_variant: MaterialVariant[];
}

interface OrderItem {
  material_variantId: number | string;
  qty: number;
  base_qty: number;
}

interface DataProp {
  staff: any;
  formData: any;
  supplyer_spc: Supplyer_Spc[];
  materials: Material[];
  calendarRef: any;
  setIsAddModalOpen: any;
  setFormData: any;
}

const AddEventCalendar = ({
  staff,
  formData,
  supplyer_spc,
  materials,
  calendarRef,
  setIsAddModalOpen,
  setFormData,
}: DataProp) => {
  const [open, setOpen] = useState(false);
  const [openItemPopovers, setOpenItemPopovers] = useState<{
    [key: number]: boolean;
  }>({});
  const setItemPopoverOpen = (index: number, isOpen: boolean) => {
    setOpenItemPopovers((prev) => ({ ...prev, [index]: isOpen }));
  };

  // Filter materials belonging to the selected supplier
  const filteredMaterials = useMemo(() => {
    if (!formData.supplier_spcId || !materials) return [];

    return materials.filter((mat) => {
      // Check direct ID or nested supplierSpc object ID
      const matSupplierId = mat.supplier_spcId;

      return matSupplierId?.toString() === formData.supplier_spcId.toString();
    });
  }, [materials, formData.supplier_spcId]);

  // 2. Lookup map to resolve variant conversion values quickly
  const variantLookup = useMemo(() => {
    const map = new Map<number, MaterialVariant>();
    materials.forEach((mat) => {
      mat.material_variant.forEach((v) => {
        map.set(v.id, v);
      });
    });
    return map;
  }, [materials]);

  // Handle adding a new item row
  const handleAddItem = () => {
    const currentItems = formData.items || [];
    setFormData({
      ...formData,
      items: [...currentItems, { material_variantId: "", qty: 1, base_qty: 1 }],
    });
  };

  // Handle removing an item row
  const handleRemoveItem = (index: number) => {
    const currentItems = formData.items || [];
    setFormData({
      ...formData,
      items: currentItems.filter((_: any, i: number) => i !== index),
    });
  };

  // Handle item input updates
  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: any,
  ) => {
    const currentItems = [...(formData.items || [])];
    const item = { ...currentItems[index], [field]: value };

    // Calculate base quantity using conver_to_base
    if (field === "material_variantId" || field === "qty") {
      const variantId = Number(item.material_variantId);
      const selectedVariant = variantLookup.get(variantId);
      const conversion = selectedVariant?.conver_to_base || 1;
      const quantity = Number(item.qty) || 0;

      item.base_qty = Math.round(quantity * conversion);
    }

    currentItems[index] = item;
    setFormData({ ...formData, items: currentItems });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_spcId) return toast.error("ກະລຸນາເລືອກບໍລິສັດກ່ອນ.");

    const validItems = (formData.items || []).filter(
      (item: OrderItem) =>
        item.material_variantId !== ''
    );

    // Optional: Check if at least one valid material item exists
    if (validItems.length === 0) {
      return toast.error("ກະລຸນາເລືອກສິນຄ້າຢ່າງໜ້ອຍ 1 ລາຍການ");
    }

    console.log(validItems)

    const supplierName =
      supplyer_spc.find((s) => s.id === formData.supplier_spcId)?.name ||
      "ບໍ່ລະບຸ";

    const payload = {
      title: supplierName,
      supplier_spcId: formData.supplier_spcId,
      description: formData.description,
      po_link: formData.po_link,
      plan_date: formData.plan_date,
      payment_date: formData.payment_date,
      delivery_date: formData.delivery_date,
      staff_officeId: staff.id,
      items: validItems.map((item: OrderItem) => ({
        material_variantId: Number(item.material_variantId),
        qty: Number(item.qty),
        base_qty: Number(item.base_qty),
      })),
    };

    try {
      await createCalendarOrderSpc(payload);

      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.refetchEvents();

      setIsAddModalOpen(false);
      toast.success("ບັນທຶກແຜນການສຳເລັດ");
    } catch (error) {
      console.error(error);
      toast.error("ບໍ່ສາມາດບັນທຶກໄດ້");
    }
  };

  const getSelectedVariantInfo = (variantId: string | number) => {
    for (const mat of filteredMaterials) {
      const variant = mat.material_variant?.find(
        (v) => String(v.id) === String(variantId),
      );
      if (variant) {
        return {
          variant,
          materialName: mat.name,
          // Uses material image, variant image, or fallback
          image: (mat as any).image || (variant as any).image || null,
        };
      }
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg border-b pb-2">ເພີ່ມແຜນໃໝ່</h3>

        {/* Supplier Selector */}
        <div className="space-y-1">
          <Label>ບໍລິສັດຜູ້ສະໜອງ</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-lao bg-white"
              >
                {formData.supplier_spcId
                  ? supplyer_spc.find(
                      (spc) => spc.id.toString() === formData.supplier_spcId,
                    )?.name
                  : "ເລືອກບໍລິສັດຜູ້ສະໜອງ..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-full p-0 font-lao z-[110]"
              align="start"
            >
              <Command shouldFilter={true}>
                <CommandInput placeholder="ຄົ້ນຫາຊື່ຜູ້ສະໜອງ..." />
                <CommandList>
                  <CommandEmpty>ບໍ່ພົບຂໍ້ມູນຜູ້ສະໜອງ.</CommandEmpty>
                  <CommandGroup>
                    {supplyer_spc.map((spc) => (
                      <CommandItem
                        key={spc.id}
                        value={spc.name}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            supplier_spcId: spc.id.toString(),
                            items: [], // Clear items on supplier change
                          });
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.supplier_spcId === spc.id.toString()
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex items-center gap-2">
                          {spc.image && (
                            <img
                              src={spc.image}
                              className="h-5 w-5 rounded-full object-cover"
                              alt=""
                            />
                          )}
                          <span>{spc.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Milestone Dates Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold">ວັນທີຊຳລະ</label>
            <input
              type="date"
              value={formData.payment_date || ""}
              className="w-full border p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold">ວັນທີສົ່ງເຄື່ອງ</label>
            <input
              type="date"
              value={formData.delivery_date || ""}
              className="w-full border p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, delivery_date: e.target.value })
              }
            />
          </div>
        </div>

        {/* Material Selection Section */}
        <div className="space-y-2 border-t pt-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700">
              ລາຍການສິນຄ້າ / Materials ({formData.items?.length || 0})
            </label>
            <button
              type="button"
              disabled={!formData.supplier_spcId}
              onClick={handleAddItem}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-40"
            >
              <Plus size={14} /> ເພີ່ມລາຍການ
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {!formData.items || formData.items.length === 0 ? (
              <div className="text-center py-4 border border-dashed rounded-lg text-xs text-slate-400">
                {formData.supplier_spcId
                  ? "ກົດ + ເພີ່ມລາຍການ ເພື່ອເລືອກສິນຄ້າ"
                  : "ກະລຸນາເລືອກບໍລິສັດຜູ້ສະໜອງກ່ອນ"}
              </div>
            ) : (
              formData.items.map((item: OrderItem, index: number) => {
                const selectedInfo = getSelectedVariantInfo(
                  item.material_variantId,
                );
                const isOpen = !!openItemPopovers[index];

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-50 border p-2 rounded-lg"
                  >
                    {/* Material Combobox with Image */}
                    <Popover
                      open={isOpen}
                      onOpenChange={(openState) =>
                        setItemPopoverOpen(index, openState)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isOpen}
                          className="flex-1 justify-between text-xs bg-white h-9 px-2.5 font-normal"
                        >
                          {selectedInfo ? (
                            <div className="flex items-center gap-2 truncate">
                              {selectedInfo.image ? (
                                <img
                                  src={selectedInfo.image}
                                  alt=""
                                  className="h-5 w-5 rounded object-cover shrink-0 border"
                                />
                              ) : (
                                <div className="h-5 w-5 rounded bg-slate-200 shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                                  📦
                                </div>
                              )}
                              <span className="truncate">
                                {selectedInfo.materialName} -{" "}
                                {selectedInfo.variant.variant_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              -- ເລືອກສິນຄ້າ --
                            </span>
                          )}
                          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-[280px] p-0 font-lao z-[120]"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="ຄົ້ນຫາສິນຄ້າ..."
                            className="text-xs"
                          />
                          <CommandList className="max-h-[200px]">
                            <CommandEmpty className="p-2 text-xs text-center text-slate-500">
                              ບໍ່ພົບຂໍ້ມູນສິນຄ້າ.
                            </CommandEmpty>

                            {filteredMaterials.map((mat) => (
                              <CommandGroup key={mat.id} heading={mat.name}>
                                {mat.material_variant &&
                                mat.material_variant.length > 0 ? (
                                  mat.material_variant.map((v) => {
                                    const matImage = mat.image || v.image;
                                    const isSelected =
                                      String(item.material_variantId) ===
                                      String(v.id);

                                    return (
                                      <CommandItem
                                        key={v.id}
                                        value={`${mat.name} ${v.variant_name}`}
                                        onSelect={() => {
                                          handleItemChange(
                                            index,
                                            "material_variantId",
                                            String(v.id),
                                          );
                                          setItemPopoverOpen(index, false); // Auto-close popover
                                        }}
                                        className="flex items-center justify-between text-xs py-1.5 cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <Check
                                            className={cn(
                                              "h-3.5 w-3.5 shrink-0",
                                              isSelected
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {matImage ? (
                                            <img
                                              src={matImage}
                                              alt=""
                                              className="h-6 w-6 rounded object-cover shrink-0 border"
                                            />
                                          ) : (
                                            <div className="h-6 w-6 rounded bg-slate-100 shrink-0 flex items-center justify-center text-[10px]">
                                              📦
                                            </div>
                                          )}
                                          <div className="truncate flex flex-col">
                                            <span className="font-medium text-slate-800">
                                              {v.variant_name}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                              Base: {v.conver_to_base}
                                            </span>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    );
                                  })
                                ) : (
                                  <div className="px-3 py-1 text-[11px] text-slate-400 italic">
                                    ບໍ່ມີ variant
                                  </div>
                                )}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Quantity Input */}
                    <input
                      type="number"
                      min="1"
                      placeholder="ຈຳນວນ"
                      value={item.qty}
                      className="w-16 border rounded p-1.5 text-xs text-center bg-white font-bold h-9 outline-none focus:border-blue-500"
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "qty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />

                    {/* Calculated Base Quantity */}
                    <div className="w-14 text-center">
                      <span className="text-[10px] text-slate-400 block">
                        Base
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {item.base_qty}
                      </span>
                    </div>

                    {/* Delete Row */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PO Document Link */}
        <div className="space-y-1">
          <label className="text-xs font-bold">ລິ້ງເອກະສານ PO (ຖ້າມີ)</label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://..."
              value={formData.po_link || ""}
              className="w-full border p-2 rounded-lg pl-8 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, po_link: e.target.value })
              }
            />
            <FileText
              size={14}
              className="absolute left-2.5 top-3 text-slate-400"
            />
          </div>
        </div>

        {/* Notes */}
        <textarea
          placeholder="ໝາຍເຫດ..."
          value={formData.description || ""}
          className="w-full border rounded-lg p-2 text-sm"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>

        {/* Save & Cancel Buttons */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          ບັນທຶກ
        </button>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="w-full text-slate-400 py-1 hover:text-slate-600"
        >
          ຍົກເລີກ
        </button>
      </div>
    </div>
  );
};

export default AddEventCalendar;
