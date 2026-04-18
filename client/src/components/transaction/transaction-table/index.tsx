import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./column";
import { _TRANSACTION_TYPE, _TransactionType } from "@/constant";
import { useState, useEffect } from "react";
import useDebouncedSearch from "@/hooks/use-debounce-search";
import {
  useBulkDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";
import { useDispatch } from "react-redux";
import { setSearchTerm as setGlobalSearchTerm } from "@/features/settings/settingsSlice";
import { useSearchParams } from "react-router-dom";

type FilterType = {
  type?: _TransactionType | undefined;
  recurringStatus?: "RECURRING" | "NON_RECURRING" | undefined;
  pageNumber?: number;
  pageSize?: number;
};

const TransactionTable = (props: {
  pageSize?: number;
  isShowPagination?: boolean;
}) => {
  const { searchTerm } = useTypedSelector((state) => state.settings);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FilterType>({
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: props.pageSize || 10,
  });

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch(searchTerm, {
    delay: 500,
  });

  // Sync debounced search with global search or URL params
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    
    // Only update the local search if the Redux term is provided
    // This allows the bar to clear without resetting the table results
    if (searchTerm) {
      setSearchTerm(searchTerm);
    } else if (urlKeyword) {
      setSearchTerm(urlKeyword || "");
    } else {
      setSearchTerm("");
    }
  }, [searchTerm, searchParams, setSearchTerm]);

  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: debouncedTerm,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  });

  const transactions = data?.transations || [];
  const pagination = {
    totalItems: data?.pagination?.totalCount || 0,
    totalPages: data?.pagination?.totalPages || 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handleSearch = (value: string) => {
    dispatch(setGlobalSearchTerm(value));
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const { type, frequently } = filters;
    setFilter((prev) => ({
      ...prev,
      type: type as _TransactionType,
      recurringStatus: frequently as "RECURRING" | "NON_RECURRING",
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  const handleBulkDelete = (transactionIds: string[]) => {
    bulkDeleteTransaction(transactionIds)
      .unwrap()
      .then(() => {
        toast.success("Transactions deleted successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete transactions");
      });
  };

  return (
    <DataTable
      data={transactions} //transactions
      columns={transactionColumns}
      searchPlaceholder="Search transactions..."
      searchTerm={searchTerm}
      isLoading={isFetching}
      isBulkDeleting={isBulkDeleting}
      isShowPagination={props.isShowPagination}
      pagination={pagination}
      filters={[
        {
          key: "type",
          label: "All Types",
          options: [
            { value: _TRANSACTION_TYPE.INCOME, label: "Income" },
            { value: _TRANSACTION_TYPE.EXPENSE, label: "Expense" },
          ],
        },
        {
          key: "frequently",
          label: "Frequently",
          options: [
            { value: "RECURRING", label: "Recurring" },
            { value: "NON_RECURRING", label: "Non-Recurring" },
          ],
        },
      ]}
      onSearch={handleSearch}
      onPageChange={(pageNumber) => handlePageChange(pageNumber)}
      onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
      onFilterChange={(filters) => handleFilterChange(filters)}
      onBulkDelete={handleBulkDelete}
    />
  );
};
export default TransactionTable;
