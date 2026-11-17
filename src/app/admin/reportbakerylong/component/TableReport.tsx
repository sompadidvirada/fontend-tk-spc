"use client";

import { useUIStore } from "@/store/ui";
import React from "react";

export interface BakeryReportItem {
  branchId: number;
  branchName: string;
  productId: number;
  productName: string;
  productImage?: string;
  sell: number;
  send: number;
  exp: number;
}

interface TableReportProps {
  data?: BakeryReportItem[];
}

const TableReport: React.FC<TableReportProps> = ({ data = [] }) => {
  const lang = useUIStore((s) => s.language);

  const t = {
    branch: lang === "LA" ? "ສາຂາ" : "Branch",
    image: lang === "LA" ? "ຮູບພາບ" : "Image",
    total: lang === "LA" ? "ທັງຫມົດ" : "Total",
    item: lang === "LA" ? "ລາຍການ" : "Item Name",
    cost: lang === "LA" ? "ຕົ້ນທຶນ" : "Cost",
    sellPrice: lang === "LA" ? "ລາຄາຂາຍ" : "Retail Price",
    sendQty: lang === "LA" ? "ສົ່ງ" : "Send",
    soldQty: lang === "LA" ? "ຂາຍ" : "Sell",
    expQty: lang === "LA" ? "ໝົດອາຍຸ" : "Exp",
    noData:
      lang === "LA"
        ? "ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາເພື່ອເບີ່ງຂໍ້ມູນລາຍງານເບເກີລີ້."
        : "Please select a date and branch to view the report.",
    loadingImage: lang === "LA" ? "ກຳລັງໂຫລດຮູບ..." : "Loading image...",
    staffPreview: lang === "LA" ? "ເບິ່ງຮູບພາບ" : "Staff Preview",
  };

  // 1. Extract unique products and keep the productImage reference
  const uniqueProducts = React.useMemo(() => {
    const map = new Map<
      number,
      { productId: number; productName: string; productImage?: string }
    >();
    data.forEach((item) => {
      if (!map.has(item.productId)) {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage, // Kept for the header render
        });
      }
    });
    return Array.from(map.values());
  }, [data]);

  // 2. Group items by branch to form rows
  const rows = React.useMemo(() => {
    const grouped: Record<
      number,
      {
        branchId: number;
        branchName: string;
        products: Record<number, BakeryReportItem>;
      }
    > = {};

    data.forEach((item) => {
      if (!grouped[item.branchId]) {
        grouped[item.branchId] = {
          branchId: item.branchId,
          branchName: item.branchName,
          products: {},
        };
      }
      grouped[item.branchId].products[item.productId] = item;
    });

    return Object.values(grouped);
  }, [data]);

  const zero = { send: 0, sell: 0, exp: 0 };

  const { productTotals, grandTotal } = React.useMemo(() => {
    const productTotals: Record<string, typeof zero> = {};
    const grandTotal = { ...zero };

    for (const row of rows) {
      for (const p of uniqueProducts) {
        const d = row.products[p.productId];
        const pt = (productTotals[p.productId] ??= { ...zero });

        pt.send += d?.send ?? 0;
        pt.sell += d?.sell ?? 0;
        pt.exp += d?.exp ?? 0;

        grandTotal.send += d?.send ?? 0;
        grandTotal.sell += d?.sell ?? 0;
        grandTotal.exp += d?.exp ?? 0;
      }
    }
    return { productTotals, grandTotal };
  }, [rows, uniqueProducts]);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border font-lao bg-white p-8 text-center text-sm text-muted-foreground">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="w-full max-w-290 overflow-x-auto rounded-md border font-lao bg-white shadow-sm block">
      <table className="w-full border-collapse table-fixed ">
        <thead>
          {/* Row 1: Product Images & Names */}
          <tr className="bg-gray-50 border-b border-gray-200">
            {/* ADDED: sticky left-0 z-20 bg-gray-50 👇 */}
            <th
              rowSpan={2}
              className="p-3 bg-gray-300 text-left align-middle text-xs font-bold uppercase tracking-wider text-gray-600 border-r border-gray-200 w-44 sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
            >
              {t.branch}
            </th>
            {uniqueProducts.map((product) => (
              <th
                key={product.productId}
                colSpan={3}
                className="p-2 text-center w-100 text-xs font-bold uppercase tracking-wider text-gray-700 border-r border-gray-200 last:border-r-0"
              >
                <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-[10px]">
                      No Img
                    </div>
                  )}
                  <span>{product.productName}</span>
                </div>
              </th>
            ))}
            <th
              colSpan={3}
              className="p-2 text-center text-xs font-bold uppercase tracking-wider text-primary border-l border-gray-300 bg-blue-50/50 w-100"
            >
              <div className="py-4 flex items-center justify-center">
                <span>{t.total}</span>
              </div>
            </th>
          </tr>

          <tr className="bg-gray-50 border-b border-gray-200">
            {uniqueProducts.map((product) => (
              <React.Fragment key={`sub-${product.productId}`}>
                <th className="p-2 text-center text-[11px] font-semibold text-gray-500 w-16">
                  {t.sendQty}
                </th>
                <th className="p-2 text-center text-[11px] font-semibold text-gray-500 w-16">
                  {t.soldQty}
                </th>
                <th className="p-2 text-center text-[11px] font-semibold text-gray-500 border-r border-gray-200 last:border-r-0 w-16">
                  {t.expQty}
                </th>
              </React.Fragment>
            ))}
            <React.Fragment>
              <th className="p-2 text-center text-[11px] font-semibold text-gray-500 w-16">
                {t.sendQty}
              </th>
              <th className="p-2 text-center text-[11px] font-semibold text-gray-500 w-16">
                {t.soldQty}
              </th>
              <th className="p-2 text-center text-[11px] font-semibold text-gray-500 border-r border-gray-200 last:border-r-0 w-16">
                {t.expQty}
              </th>
            </React.Fragment>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const rowTotal = uniqueProducts.reduce(
              (acc, p) => {
                const d = row.products[p.productId];
                return {
                  send: acc.send + (d?.send ?? 0),
                  sell: acc.sell + (d?.sell ?? 0),
                  exp: acc.exp + (d?.exp ?? 0),
                };
              },
              { ...zero },
            );

            return (
              <tr
                key={row.branchId}
                className="group border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-xs font-medium text-gray-900 border-r border-gray-200 sticky left-0 z-10 bg-white group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {row.branchName}
                </td>

                {uniqueProducts.map((product) => {
                  const d = row.products[product.productId];
                  return (
                    <React.Fragment
                      key={`${row.branchId}-${product.productId}`}
                    >
                      <td className="p-2 text-center text-xs text-gray-600">
                        {(d?.send ?? 0).toLocaleString()}
                      </td>
                      <td className="p-2 text-center text-xs text-gray-600">
                        {(d?.sell ?? 0).toLocaleString()}
                      </td>
                      <td className="p-2 text-center text-xs text-gray-600 border-r border-gray-200">
                        {(d?.exp ?? 0).toLocaleString()}
                      </td>
                    </React.Fragment>
                  );
                })}

                <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-50/20 border-r border-gray-300">
                  {rowTotal.send.toLocaleString()}
                </td>
                <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-50/20 border-r border-gray-300">
                  {rowTotal.sell.toLocaleString()}
                </td>
                <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-50/20">
                  {rowTotal.exp.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-gray-100">
            <td className="p-3 text-xs font-bold text-gray-900 border-r border-gray-300 sticky left-0 z-10 bg-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              {t.total} {/* or your own label, e.g. t.allBranches */}
            </td>

            {uniqueProducts.map((product) => {
              const pt = productTotals[product.productId] ?? zero;
              return (
                <React.Fragment key={`total-${product.productId}`}>
                  <td className="p-2 text-center text-xs font-bold text-blue-700">
                    {pt.send.toLocaleString()}
                  </td>
                  <td className="p-2 text-center text-xs font-bold text-green-700">
                    {pt.sell.toLocaleString()}
                  </td>
                  <td className="p-2 text-center text-xs font-bold text-red-700 border-r border-gray-300">
                    {pt.exp.toLocaleString()}
                  </td>
                </React.Fragment>
              );
            })}

            <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-100/60 border-r border-gray-300">
              {grandTotal.send.toLocaleString()}
            </td>
            <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-100/60 border-r border-gray-300">
              {grandTotal.sell.toLocaleString()}
            </td>
            <td className="p-2 text-center text-xs font-bold text-gray-900 bg-blue-100/60">
              {grandTotal.exp.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableReport;
