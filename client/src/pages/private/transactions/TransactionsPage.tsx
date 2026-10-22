import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

import TransactionCard from "../../../components/TransactionCard";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { transactionEndpoints } from "../../../services/transaction.service";

import useApi from "../../../hooks/useApi";

import type {
  PaginationData,
  PaginationParams,
  Transaction,
} from "../../../types/api.types";

const TransactionsPage = () => {
  const { loading, callApi } = useApi({ transactionsLoading: false });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchTransactions = useCallback(() => {
    callApi(
      "transactionsLoading",
      () => transactionEndpoints.getTransactions(params),
      {
        onSuccess: (res) => {
          setTransactions(res.data.data);
          setPagination(res.data.pagination);
        },
      },
    );
  }, [callApi, params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Transaction"
        icon={ArrowLeftRight}
        onClick={() => navigate("add")}
        className="self-end w-fit"
      />

      {loading.transactionsLoading ? (
        <div>Loading transactions...</div>
      ) : transactions?.length ? (
        transactions?.map((transaction) => (
          <TransactionCard
            key={transaction?._id}
            transaction={transaction}
            onDelete={() =>
              setTransactions((prev) =>
                prev.filter((item) => item._id !== transaction?._id),
              )
            }
          />
        ))
      ) : (
        <div>No transactions yet.</div>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default TransactionsPage;
