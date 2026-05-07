import React, { useMemo } from "react";

const ComponentToPrint3Month = React.forwardRef<HTMLDivElement, any>(
  ({ dataMap }, ref) => {
    
    // 1. Sort the Months (e.g., "2026-05", "2026-04", "2026-03")
    const months = useMemo(() => 
      Object.keys(dataMap).sort((a, b) => b.localeCompare(a)), 
    [dataMap]);

    // 2. Create a UNIQUE and SORTED list of Branches by ID
    const sortedBranchList = useMemo(() => {
      const branches = new Map<number, string>();
      
      // Look through all months to find every branch that exists
      Object.values(dataMap).flat().forEach((b: any) => {
        if (b && !branches.has(b.branchId)) {
          branches.set(b.branchId, b.branchName);
        }
      });
      
      // Convert Map to Array and SORT by Branch ID (a[0] is the ID)
      return Array.from(branches.entries()).sort((a, b) => {
        return a[0] - b[0]; // For numeric IDs (1, 2, 3...)
        // Use a[0].toString().localeCompare(b[0].toString()) if IDs are strings
      });
    }, [dataMap]);

    const formatCurrency = (num: number) =>
      new Intl.NumberFormat("en-US").format(num);

    return (
      <div ref={ref} className="p-4 font-lao text-black bg-white">
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap');

          @media print {
            /* Force the font on everything */
            * {
              font-family: 'Noto Sans Lao', sans-serif !important;
            }
            /* If you have specific classes */
            .font-lao {
              font-family: 'Noto Sans Lao', sans-serif !important;
            }
          }
        `}
      </style>
        <h2 className="text-center text-xl font-bold mb-4 uppercase underline">
            ລາຍງານປຽບທຽບຍອດຂາຍ 3 ເດືອນ
        </h2>

        <table className="w-full border-collapse border border-gray-400 text-[10px]">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-400 p-2" rowSpan={2}>ຊື່ ສາຂາ</th>
              {months.map((m) => (
                <th key={m} className="border border-gray-400 p-1" colSpan={4}>
                  ເດືອນ {m}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-100 text-[9px]">
              {months.map((m) => (
                <React.Fragment key={`${m}-sub`}>
                  <th className="border border-gray-400 p-1">ສົ່ງ</th>
                  <th className="border border-gray-400 p-1 bg-yellow-50">ຂາຍ</th>
                  <th className="border border-gray-400 p-1">ເສຍ</th>
                  <th className="border border-gray-400 p-1">% ເສຍ</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 3. We loop through the SORTED list of branches */}
            {sortedBranchList.map(([id, name]) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border border-gray-400 p-2 font-bold bg-gray-50">
                   {name}
                </td>
                {months.map((m) => {
                  // Find the data for THIS specific branch in THIS specific month
                  const branchData = dataMap[m]?.find((b: any) => b.branchId === id);
                  
                  return (
                    <React.Fragment key={`${m}-${id}`}>
                      <td className="border border-gray-400 p-1 text-right">
                        {formatCurrency(branchData?.total_send || 0)}
                      </td>
                      <td className="border border-gray-400 p-1 text-right font-bold bg-yellow-50/30">
                        {formatCurrency(branchData?.total_sell || 0)}
                      </td>
                      <td className="border border-gray-400 p-1 text-right text-red-600">
                        {formatCurrency(branchData?.total_exp || 0)}
                      </td>
                      <td className="border border-gray-400 p-1 text-center">
                        {branchData?.percent_expired ? `${branchData.percent_expired.toFixed(2)}%` : "0%"}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {/* Footer calculation logic remains the same... */}
        </table>
      </div>
    );
  }
);

export default ComponentToPrint3Month;