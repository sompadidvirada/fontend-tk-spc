import React from "react";
import { format } from "date-fns";

interface BranchHeader {
  id: number;
  name: string;
}

interface TableRowData {
  bakeryName: string;
  bakeryId: number;
  total: number;
  categotyName?: string;
  [key: string]: string | number | any;
}

interface ComponentPrintProps {
  dataToPrint:
    | {
        date: string;
        branches: BranchHeader[];
        tableData: TableRowData[];
      }
    | null
    | undefined;
}

const ComponentPrint2 = React.forwardRef<HTMLDivElement, ComponentPrintProps>(
  (props, ref) => {
    const { dataToPrint } = props;
    const CATEGORY_COLORS: Record<string, string> = {
      ຄົວຊ່ອງ: "#FFECB3",
      ເຄັກ: "#F8BBD0",
      ຄອປໂຟ: "#DCEDC8",
      ເຄື່ອງດື່ມ: "#B3E5FC",
      "ເບເກີລີ້ ອຶ່ນໆ": "#E1BEE7",
      ທິມເບີລິ້ງ: "#FFCCBC",
    };

    if (!dataToPrint) return <div ref={ref}>...</div>;

    return (
      <div
        ref={ref}
        className="p-10 bg-white font-lao"
        style={{ fontFamily: "Noto Sans Lao" }}
      >
        {/* Main Report Header */}
        <div className="border-[4px] border-double border-black p-4 mb-6 text-center bg-blue-200">
          <h1 className="text-2xl font-black italic">ລາຍງານການສັ່ງຊື້ສິນຄ້າ</h1>
          <p className="font-bold uppercase">
            Report Date: {format(new Date(dataToPrint.date), "dd/MM/yyyy")}
          </p>
        </div>

        {/* Separate Section & Table for Each Branch */}
        <div className="space-y-8">
          {dataToPrint.branches.map((branch) => {
            // Filter out items where quantity ordered for this branch is zero or empty
            const branchItems = dataToPrint.tableData.filter((row) => {
              const qty = Number(row[`branch_${branch.id}`]) || 0;
              return qty > 0;
            });

            // Calculate branch total quantity
            const totalQty = branchItems.reduce(
              (sum, row) => sum + (Number(row[`branch_${branch.id}`]) || 0),
              0
            );

            return (
              <div
                key={branch.id}
                className="border-2 border-black p-4 rounded-sm break-inside-avoid"
              >
                {/* Branch Sub-Header */}
                <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-black bg-gray-100 p-2">
                  <h2 className="text-lg font-black">
                    ສາຂາ: <span className="text-blue-800">{branch.name}</span>
                  </h2>
                  <span className="text-sm font-bold">
                    ຈຳນວນລາຍການ: {branchItems.length}
                  </span>
                </div>

                {/* Branch Specific Table */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-2 border-black bg-gray-200">
                      <th className="border-2 border-black p-2 text-left w-12">
                        No.
                      </th>
                      <th className="border-2 border-black p-2 text-left">
                        ລາຍການສິນຄ້າ
                      </th>
                      <th className="border-2 border-black p-2 text-center w-32">
                        ຈຳນວນ (Qty)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchItems.length > 0 ? (
                      branchItems.map((row, index) => {
                        const qty = row[`branch_${branch.id}`];
                        return (
                          <tr
                            key={index}
                            className="border-b border-black"
                            style={{
                              backgroundColor:
                                CATEGORY_COLORS[row.categotyName || ""] || "white",
                            }}
                          >
                            <td className="border-2 border-black px-2 py-1 text-center font-medium">
                              {index + 1}
                            </td>
                            <td className="border-2 border-black px-2 py-1 font-medium">
                              {row.bakeryName}
                            </td>
                            <td className="border-2 border-black p-1 text-center font-bold">
                              {qty}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="border-2 border-black p-4 text-center text-gray-500 italic"
                        >
                          ບໍ່ມີລາຍການສັ່ງຊື້ (No orders)
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {/* Branch Total Row */}
                  <tfoot>
                    <tr className="border-2 border-black font-black bg-gray-100">
                      <td
                        colSpan={2}
                        className="p-2 text-right border-r-2 border-black"
                      >
                        ລວມທັງໝົດ ({branch.name}):
                      </td>
                      <td className="p-2 text-center text-lg">{totalQty}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default ComponentPrint2;