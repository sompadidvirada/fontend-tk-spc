import { Button } from "@/components/ui/button";
import { FolderUp } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Bakery_send } from "./ParentTable";
import { BakeryDetail } from "../../tracksell/(component)/TableData";
import { uploadTrackingSend } from "@/app/api/client/trackingbakery";

interface CalendarProp {
  selectedDate: Date | undefined;
  bakerys: BakeryDetail[];
  value: string;
  setCheckBakery: React.Dispatch<React.SetStateAction<Bakery_send[]>>;
}

const UploadFile = ({
  selectedDate,
  bakerys,
  value,
  setCheckBakery,
}: CalendarProp) => {
  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Basic Guards
    if (!selectedDate || !value) {
      toast.error("ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາກ່ອນອັປໂຫລດ");
      event.target.value = "";
      return;
    }

    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("ຟາຍທີ່ອັປໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    // 2. Parse HTML
    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const rows = doc.querySelectorAll("table.list tr");

    // Use a Map to aggregate counts if a product appears multiple times
    const extractedMap = new Map<
      number,
      {
        bakery_detailId: number;
        quantity: number;
        price: number;
        sell_price: number;
      }
    >();

    for (const row of rows) {
      try {
        const cells = row.querySelectorAll("td");

        if (cells.length < 7 || !cells[2].querySelector("img")) {
          continue;
        }

        const name = cells[3].textContent?.trim() || "";
        const rawCount = cells[4].textContent?.trim() || "";

        const countMatch = rawCount.match(/\d+/);
        const sendCount = countMatch ? parseInt(countMatch[0], 10) : 0;

        const product = bakerys.find(
          (p) => p.name.trim().toLowerCase() === name.toLowerCase(),
        );

        if (product && sendCount > 0) {
          const id = Number(product.id);
          const unitPrice = Number(product.price);
          const unitSellPrice = Number(product.sell_price);

          if (!extractedMap.has(id)) {
            extractedMap.set(id, {
              bakery_detailId: id,
              quantity: sendCount,
              price: unitPrice,
              sell_price: unitSellPrice,
            });
          } else {
            const existing = extractedMap.get(id)!;
            existing.quantity += sendCount;
          }
        } else if (!product && name) {
          console.warn(`Product not found: ${name}`);
        }
      } catch (error) {
        console.error("Error processing row:", error, row);
        continue; // Skip this row and continue to the next one
      }
    }

    // 3. Prepare Final Array
    const itemsToUpdate = Array.from(extractedMap.values());

    if (itemsToUpdate.length === 0) {
      toast.error("ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັບລາຍການໃນລະບົບ");
      event.target.value = "";
      return;
    }

    // 4. Construct Final Payload for API
    const finalPayload = {
      branchId: Number(value),
      date: selectedDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
      items: itemsToUpdate,
    };

    try {
      const ress = await uploadTrackingSend(finalPayload);

      const dataFromUploadRespone = ress.data;

      console.log(dataFromUploadRespone)
      setCheckBakery((prev) => [...prev, ...dataFromUploadRespone]);
      toast.success(
        `ອັປໂຫລດເບເກີລີ້ຈຳນວນ ${itemsToUpdate.length} ລາຍການສຳເລັດ.`,
      );
    } catch (err) {
      console.error(err);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນ");
    } finally {
      event.target.value = ""; // Clear input for next use
    }
  };
  return (
    <div className="flex items-center">
      {/* 1. The actual input is hidden */}
      <input
        type="file"
        id="file-upload"
        disabled={selectedDate && value ? false : true}
        accept=".html"
        className="hidden"
        onChange={handleUploadFile}
      />

      {/* 2. The Label is styled to look exactly like your Button */}
      <Button
        asChild // This allows the Button to behave like the Label inside it
        disabled={selectedDate && value ? false : true}
        variant="outline"
        className="font-lao h-8 md:h-9 max-w-50 cursor-pointer"
      >
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 cursor-pointer"
        >
          <FolderUp className="h-4 w-4" />
          ອັປໂຫລດຟາຍ
        </label>
      </Button>
    </div>
  );
};

export default UploadFile;
