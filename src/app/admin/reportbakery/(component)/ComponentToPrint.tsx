import React from "react";
import { DateRange } from "react-day-picker";
import { BakeryData } from "./TableReport";

interface PrintReportProps {
  data: BakeryData[];
  branchName: string;
  dateRange: DateRange | undefined;
}

const ComponentToPrint = React.forwardRef<HTMLDivElement, PrintReportProps>(
  ({ data, branchName, dateRange }, ref) => {
    const formatCurrency = (num: number) =>
      new Intl.NumberFormat("en-US").format(num);

    // Calculate Grand Totals
    const totals = data.reduce(
      (acc, item) => {
        acc.sendQty += item.send.qty;
        acc.sellQty += item.sell.qty;
        acc.expQty += item.exp.qty;
        acc.totalExpCost += item.exp.total_cost;
        acc.totalSendCost += item.send.total_cost;
        acc.revenue += item.sell.total_revenue;
        return acc;
      },
      {
        sendQty: 0,
        sellQty: 0,
        expQty: 0,
        revenue: 0,
        totalExpCost: 0,
        totalSendCost: 0,
      },
    );

    const totalExpPercent =
      totals.sendQty > 0
        ? ((totals.expQty / totals.sendQty) * 100).toFixed(2)
        : "0";

    return (
      <div ref={ref} className="p-10 font-lao text-black bg-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `
      @media print {
        @font-face {
          font-family: 'Noto Sans Lao'; /* Ensure this matches your actual font name */
          src: url('/fonts/noto-sans-lao.woff2') format('woff2'); 
        }
        .font-lao {
          font-family: 'Noto Sans Lao', sans-serif !important;
        }
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
          }}
        />
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-lao uppercase">
            ໃບລາຍງານສັງລວມເບເກີຣີ່
          </h1>
          <p className="text-sm mt-2">
            ສາຂາ: {branchName === "all" ? "ທຸກສາຂາ" : branchName || "ທຸກສາຂາ"}
          </p>
          <p className="text-sm">
            ວັນທີ: {dateRange?.from?.toLocaleDateString("en-Ca")} -{" "}
            {dateRange?.to?.toLocaleDateString("en-Ca")}{" "}
          </p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-400 text-[12px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left">ລາຍການ</th>
              <th className="border border-gray-400 p-2 text-right">
                ສົ່ງ (Send)
              </th>
              <th className="border border-gray-400 p-2 text-right">
                ຂາຍ (Sell)
              </th>
              <th className="border border-gray-400 p-2 text-right">
                ເສຍ (Exp)
              </th>
              <th className="border border-gray-400 p-2 text-right">
                ມູນຄ່າຍອດສົ່ງ
              </th>
              <th className="border border-gray-400 p-2 text-right">
                ມູນຄ່າຍອດຂາຍ
              </th>
              <th className="border border-gray-400 p-2 text-right">
                ມູນຄ່າຍອດໝົດອາຍຸ
              </th>

              <th className="border border-gray-400 p-2 text-right">% ເສຍ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-400 p-2 font-medium">
                  <div className="flex items-center gap-3">
                    {/* Standard img tag is better for print compatibility */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded border border-gray-200"
                        // This helps the printer wait for the image
                        loading="eager"
                      />
                    )}
                    <span>{item.name}</span>
                  </div>
                </td>

                <td className="border border-gray-400 p-2 text-right">
                  {item.send.qty}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {item.sell.qty}
                </td>
                <td className="border border-gray-400 p-2 text-right text-red-600">
                  {item.exp.qty}
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatCurrency(item.send.total_cost)} ₭
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {formatCurrency(item.sell.total_revenue)} ₭
                </td>
                <td className="border border-gray-400 p-2 text-right text-red-600">
                  {formatCurrency(item.exp.total_cost)} ₭
                </td>

                <td className="border border-gray-400 p-2 text-right">
                  {item.percentExp}%
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer Totals */}
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-400 p-2 text-right">
                ລວມທັງໝົດ:
              </td>
              <td className="border border-gray-400 p-2 text-right">
                {totals.sendQty}
              </td>
              <td className="border border-gray-400 p-2 text-right">
                {totals.sellQty}
              </td>
              <td className="border border-gray-400 p-2 text-right text-red-600">
                {totals.expQty}
              </td>
              <td className="border border-gray-400 p-2 text-right">
                {formatCurrency(totals.totalSendCost)} ₭
              </td>

              <td className="border border-gray-400 p-2 text-right">
                {formatCurrency(totals.revenue)} ₭
              </td>
              <td className="border border-gray-400 p-2 text-right">
                {formatCurrency(totals.totalExpCost)} ₭
              </td>
              <td className="border border-gray-400 p-2 text-right text-blue-700">
                {totalExpPercent}%
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Signature Area */}
        <div className="mt-16 flex justify-between px-10">
          <div className="text-right">
            <p>ຜູ້ຈັດທຳ</p>
            <div className="mt-12 border-t border-black w-32 mx-auto"></div>
          </div>
          <div className="text-right">
            <p>ຜູ້ກວດສອບ</p>
            <div className="mt-12 border-t border-black w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  },
);

export default ComponentToPrint;
