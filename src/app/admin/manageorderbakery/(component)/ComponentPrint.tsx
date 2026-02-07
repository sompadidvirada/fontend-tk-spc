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

const ComponentPrint = React.forwardRef<HTMLDivElement, ComponentPrintProps>(
  (props, ref) => {
    const { dataToPrint } = props;
    const CATEGORY_COLORS: Record<string, string> = {
      ຄົວຊ່ອງ: "#53c8ffff", // e.g., Cakes (Blue)
      ເຄັກ: "#eeb919ff", // e.g., Croissants (Yellow)
      ຄອປໂຟ: "#F2E9FF", // e.g., Croffles (Purple)
      ເຄື່ອງດື່ມ: "#ff8f2cff", // e.g., Choux (Orange)
      // Add more IDs as needed from your database
    };

    if (!dataToPrint) {
      return (
        <div ref={ref} className="p-10 font-lao">
          ບໍ່ມີຂໍ້ມູນສຳລັບພິມ
        </div>
      );
    }

    console.log(dataToPrint);

    return (
      <div
        ref={ref}
        className="p-4 bg-white text-black print:p-0"
        style={{ fontFamily: "Noto Sans Lao" }}
      >
        {/* Title */}
        <p className="text-[24px] font-bold mb-4">
          ອໍເດີປະຈຳວັນທີ່ {format(new Date(dataToPrint.date), "dd/MM/yyyy")}
        </p>

        <table className="w-full border-collapse border-[2px] border-black text-center">
          <thead>
            <tr className="bg-yellow-400 font-bold">
              <th className="border-[2px] border-black p-2 min-w-[150px] text-left">
                ລາຍການ
              </th>

              {dataToPrint.branches.map((branch) => (
                <th
                  key={branch.id}
                  className="border-[2px] border-black px-1 h-40 w-10 min-w-[40px] relative align-bottom pb-2"
                >
                  {/* Vertical Text Container */}

                  {branch.name}
                </th>
              ))}

              <th className="border-[2px] border-black p-2 w-20">TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {dataToPrint.tableData.map((row, index) => {
              // Use the ID from your backend response
              // If the ID isn't in our map, default to white
              const rowColor = CATEGORY_COLORS[row.categotyName] || "white";

              return (
                <tr
                  key={index}
                  className="border-b border-black"
                  style={{ backgroundColor: rowColor }}
                >
                  <td className="border-[1.5px] border-black px-2 py-1 text-left font-medium">
                    {row.bakeryName}
                  </td>

                  {dataToPrint.branches.map((branch) => (
                    <td
                      key={branch.id}
                      className="border-[1.5px] border-black p-1 font-bold"
                    >
                      {/* Accessing the dynamic key branch_ID */}
                      {row[`branch_${branch.id}`] !== 0
                        ? row[`branch_${branch.id}`]
                        : ""}
                    </td>
                  ))}

                  <td className="border-[1.5px] border-black p-1 font-bold bg-gray-100">
                    {row.total}
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="bg-gray-200 font-bold text-[14px]">
              <td className="border-[2px] border-black p-2 text-right">ລວມ</td>
              {dataToPrint.branches.map((branch) => {
                const colTotal = dataToPrint.tableData.reduce(
                  (sum, r) => sum + (Number(r[`branch_${branch.id}`]) || 0),
                  0,
                );
                return (
                  <td key={branch.id} className="border-[2px] border-black">
                    {colTotal}
                  </td>
                );
              })}
              <td className="border-[2px] border-black">
                {dataToPrint.tableData.reduce((sum, r) => sum + r.total, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
);

export default ComponentPrint;
