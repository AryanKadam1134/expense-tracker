import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

import TransactionCard from "../../../components/TransactionCard";
import PageHeader from "../../../components/common/PageHeader";

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
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Transactions"
        subHeading="See where money is moving across your accounts."
      >
        <CustomButton
          name="Add Transaction"
          icon={ArrowLeftRight}
          onClick={() => navigate("add")}
          className="w-fit"
        />
      </PageHeader>

      {loading.transactionsLoading ? (
        <div className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading transactions...
        </div>
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
        <div className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No transactions yet. Add your first transaction to begin tracking
          activity.
        </div>
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
