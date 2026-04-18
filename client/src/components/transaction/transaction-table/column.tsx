/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowUpDown,
  CircleDot,
  Copy,
  Loader,
  LucideIcon,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";  
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
import { TransactionType } from "@/features/transaction/transationType";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import {
  useDeleteTransactionMutation,
  useDuplicateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

type FrequencyInfo = {
  label: string;
  icon: LucideIcon;
};
type FrequencyMapType = {
  [key: string]: FrequencyInfo;
  DEFAULT: FrequencyInfo;
};

export const transactionColumns: ColumnDef<TransactionType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-black text-foreground uppercase tracking-widest text-[10px]"
      >
        Date Created
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-muted-foreground font-bold text-xs">{format(row.getValue("createdAt"), "MMM dd, yyyy")}</span>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-bold text-foreground tracking-tight">{row.original.title}</span>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!pl-0 font-black text-foreground uppercase tracking-widest text-[10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="capitalize px-3 py-1 rounded-lg bg-secondary/50 text-muted-foreground text-[10px] font-black tracking-widest border border-white/5">{category}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="font-black text-foreground uppercase tracking-widest text-[10px]"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isIncome = type === _TRANSACTION_TYPE.INCOME;

      return (
        <div className="flex items-center">
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
              isIncome
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-100"
            )}
          >
            {type}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <AmountCell row={row} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transaction Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.original.date, "MMM dd, yyyy"),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      if (!paymentMethod) return "N/A";
      //remove _
      const paymentMethodWithoutUnderscore = paymentMethod
        ?.replace("_", " ")
        ?.toLowerCase();
      return <div className="capitalize">{paymentMethodWithoutUnderscore}</div>;
    },
  },
  {
    accessorKey: "recurringInterval",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Frequently
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const frequency = row.getValue("recurringInterval");
      const nextDate = row.original?.nextRecurringDate;
      const isRecurring = row.original?.isRecurring;

      const frequencyMap: FrequencyMapType = isRecurring
        ? {
          [_TRANSACTION_FREQUENCY.DAILY]: { label: "Daily", icon: RefreshCw },
          [_TRANSACTION_FREQUENCY.WEEKLY]: {
            label: "Weekly",
            icon: RefreshCw,
          },
          [_TRANSACTION_FREQUENCY.MONTHLY]: {
            label: "Monthly",
            icon: RefreshCw,
          },
          [_TRANSACTION_FREQUENCY.YEARLY]: {
            label: "Yearly",
            icon: RefreshCw,
          },
          DEFAULT: { label: "One-time", icon: CircleDot }, // Fallback
        }
        : { DEFAULT: { label: "One-time", icon: CircleDot } };

      const frequencyKey = isRecurring ? (frequency as string) : "DEFAULT";
      const frequencyInfo =
        frequencyMap?.[frequencyKey] || frequencyMap.DEFAULT;
      const { label, icon: Icon } = frequencyInfo;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{label}</span>
            {nextDate && isRecurring && (
              <span className="text-xs text-muted-foreground">
                Next: {format(nextDate, "MMM dd yyyy")}
              </span>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

const AmountCell = ({ row }: { row: any }) => {
  const amount = parseFloat(row.getValue("amount"));
  const type = row.getValue("type");
  const formatCurrency = useFormatCurrency();

  return (
    <div
      className={cn(
        "text-right font-bold text-base tracking-tight transition-colors duration-300",
        type === _TRANSACTION_TYPE.INCOME ? "text-emerald-600" : "text-rose-600"
      )}
    >
      <span className="opacity-70 mr-0.5">{type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}</span>
      {formatCurrency(amount)}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const ActionsCell = ({ row }: { row: any }) => {
  //const isRecurring = row.original.isRecurring;
  const transactionId = row.original.id;
  const { onOpenDrawer } = useEditTransactionDrawer();

  const [duplicateTransaction, { isLoading: isDuplicating }] =
    useDuplicateTransactionMutation();

  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const handleDuplicate = (e: Event) => {
    e.preventDefault();
    if (isDuplicating) return;
    duplicateTransaction(transactionId)
      .unwrap()
      .then(() => {
        toast.success("Transaction duplicated successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to duplicate transaction");
      });
  };

  const handleDelete = (e: Event) => {
    e.preventDefault();
    if (isDeleting) return;
    deleteTransaction(transactionId)
      .unwrap()
      .then(() => {
        toast.success("Transaction deleted successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete transaction");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5"
        align="end"
        onCloseAutoFocus={(e) => {
          if (isDeleting || isDuplicating) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuItem
          onClick={() => onOpenDrawer(transactionId)}
          className="rounded-lg py-2 cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50"
        >
          <Pencil className="mr-2 h-4 w-4 text-blue-600" />
          <span className="font-medium">Edit Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="relative rounded-lg py-2 cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50"
          disabled={isDuplicating}
          onSelect={handleDuplicate}
        >
          <Copy className="mr-2 h-4 w-4 text-slate-600" />
          <span className="font-medium">Duplicate Entry</span>
          {isDuplicating && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100 my-1" />
        <DropdownMenuItem
          className="relative !text-rose-600 font-bold rounded-lg py-2 cursor-pointer hover:bg-rose-50 transition-colors focus:bg-rose-50"
          disabled={isDeleting}
          onSelect={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Record</span>
          {isDeleting && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
