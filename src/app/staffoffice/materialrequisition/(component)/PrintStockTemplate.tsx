import React from "react";
import { Material } from "../../material/page";
import { Stock_Requisition } from "./TableMaterial";

interface PrintProps {
  check: Stock_Requisition[];
  materials: Material[];
  date: string | undefined;
  branchName: string;
}

export const PrintStockTemplate = React.forwardRef<HTMLDivElement, PrintProps>(
  ({ check, materials, date, branchName }, ref) => {
    
    // Helper to format currency
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat().format(num);
    };

    const getDetails = (variantId: number) => {
      for (const m of materials) {
        const variant = m.material_variant.find((v) => v.id === variantId);
        if (variant) {
          return {
            materialName: m.name,
            variantName: variant.variant_name,
            barcode: variant.barcode,
            price_kip: variant.price_kip || 0,
            sell_price_kip: variant.sell_price_kip || 0,
            price_bath: variant.price_bath || 0,
            sell_price_bath: variant.sell_price_bath || 0,
          };
        }
      }
      return { 
        materialName: "Unknown", variantName: "", barcode: "", 
        price_kip: 0, sell_price_kip: 0, price_bath: 0, sell_price_bath: 0 
      };
    };

    // Calculate Grand Totals
    const grandTotalKip = check.reduce((acc, item) => {
      const details = getDetails(item.material_variantId);
      return acc + (item.quantity * details.price_kip);
    }, 0);

    return (
      <div ref={ref} className="p-10 font-lao text-black" style={{ fontFamily: "Noto Sans Lao" }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">ໃບບິນສົ່ງເຄື່ອງວັດຖຸດິບ</h1>
          <p>ສາຂາ: {branchName || "ທັງໝົດ"}</p>
          <p>ວັນທີ: {date}</p>
        </div>

        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">ລຳດັບ</th>
              <th className="border border-black p-1 text-left">ລາຍການ</th>
              <th className="border border-black p-1">ບາໂຄ້ດ</th>
              <th className="border border-black p-1">ຈຳນວນ</th>
              <th className="border border-black p-1">ລາຄາຊື້ (ກີບ)</th>
              <th className="border border-black p-1">ລາຄາຂາຍ (ກີບ)</th>
              <th className="border border-black p-1">ລາຄາຊື້ (ບາດ)</th>
              <th className="border border-black p-1">ລາຄາຂາຍ (ບາດ)</th>
              <th className="border border-black p-1">ລວມ (ກີບ)</th>
            </tr>
          </thead>
          <tbody>
            {check.map((item, index) => {
              const details = getDetails(item.material_variantId);
              const rowTotalKip = item.quantity * details.price_kip;
              
              return (
                <tr key={index}>
                  <td className="border border-black p-1 text-center">{index + 1}</td>
                  <td className="border border-black p-1">
                    {details.materialName} ({details.variantName})
                  </td>
                  <td className="border border-black p-1 text-center">{details.barcode}</td>
                  <td className="border border-black p-1 text-center font-bold">{item.quantity}</td>
                  <td className="border border-black p-1 text-right">{formatNumber(details.price_kip)}</td>
                  <td className="border border-black p-1 text-right">{formatNumber(details.sell_price_kip)}</td>
                  <td className="border border-black p-1 text-right">{formatNumber(details.price_bath)}</td>
                  <td className="border border-black p-1 text-right">{formatNumber(details.sell_price_bath)}</td>
                  <td className="border border-black p-1 text-right font-bold">{formatNumber(rowTotalKip)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={8} className="border border-black p-2 text-right font-bold">ມູນຄ່າລວມທັງໝົດ (ກີບ):</td>
              <td className="border border-black p-2 text-right font-bold text-lg">
                {formatNumber(grandTotalKip)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between mt-20">
          <div className="text-center">
            <p>ຜູ້ຈັດສົ່ງ</p>
            <div className="mt-10 border-t border-black w-40"></div>
          </div>
          <div className="text-center">
            <p>ຜູ້ຮັບເຄື່ອງ</p>
            <div className="mt-10 border-t border-black w-40"></div>
          </div>
        </div>
      </div>
    );
  }
);

PrintStockTemplate.displayName = "PrintStockTemplate";