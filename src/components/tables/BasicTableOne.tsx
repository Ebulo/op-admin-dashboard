import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

// Generic Type
interface Column<T> {
  header: string;
  accessor: keyof T | string; // can be nested e.g., "task_type.name"
  render?: (item: T) => React.ReactNode; // optional custom renderer
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  showSerialNumber?: boolean;
}

// export default function GenericTable<T>({ data, columns }: GenericTableProps<T>) {
//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         <div className="min-w-[1102px]">
//           <Table>
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 {columns.map((col, idx) => (
//                   <TableCell
//                     isHeader
//                     key={idx}
//                     className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                   >
//                     {col.header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHeader>

//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {data.map((item, index) => (
//                 <TableRow key={index}>
//                   {columns.map((col, idx) => (
//                     <TableCell
//                       key={idx}
//                       className="px-5 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400"
//                     >
//                       {col.render
//                         ? col.render(item)
//                         : getNestedValue(item, col.accessor as string)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }


// --- Nested value getter (optional helper)
function getNestedValue<T>(obj: T, path: string): string | number | boolean | null | undefined {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj) as string | number | boolean | null | undefined;
}

export default function GenericTable<T>({
  data,
  columns,
  showSerialNumber = false, // 👈 default off
}: GenericTableProps<T>) {
  const fullColumns = showSerialNumber
    ? [{ header: "S.No", accessor: "__serial__" }, ...columns]
    : columns;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {fullColumns.map((col, idx) => (
                  <TableCell
                    isHeader
                    key={idx}
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((item, index) => (
                <TableRow key={index}>
                  {fullColumns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className="px-5 py-3 text-gray-500 text-theme-sm text-start dark:text-gray-400"
                    >
                      {col.accessor === "__serial__"
                        ? index + 1
                        : col.render
                          ? col.render(item)
                          : getNestedValue(item, col.accessor as string)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}