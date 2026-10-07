import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { SquareUserRound } from "lucide-react";

import TransactionCard from "../../../components/TransactionCard";

import CustomButton from "../../../components/ui/CustomButton";

import { transactionEndpoints } from "../../../services/transaction.service";

import useApi from "../../../hooks/useApi";

import type { Transaction } from "../../../types/api.types";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { loading, callApi } = useApi({ transactionsLoading: false });

  const navigate = useNavigate();

  const fetchTransactions = useCallback(() => {
    callApi("transactionsLoading", transactionEndpoints.getTransactions, {
      onSuccess: (res) => {
        setTransactions(res.data);
      },
    });
  }, [callApi]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading.transactionsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Transaction"
        icon={SquareUserRound}
        onClick={() => navigate("add")}
        className="self-end w-fit"
      />

      {transactions?.map((transaction) => (
        <TransactionCard
          key={transaction?._id}
          transaction={transaction}
          onDelete={() =>
            setTransactions((prev) =>
              prev.filter((item) => item._id !== transaction?._id),
            )
          }
        />
      ))}
    </div>
  );
};

export default TransactionsPage;
