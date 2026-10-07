import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

import { transactionEndpoints } from "../services/transaction.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Transaction } from "../types/api.types";

type transactionCardsProps = {
  transaction: Transaction;
  onDelete: () => void;
};

const TransactionCard = ({ transaction, onDelete }: transactionCardsProps) => {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ deleting: false });

  const {
    _id,
    account,
    title,
    description,
    type,
    // date,
    category,
    amount,
    transferId,
    note,
  } = transaction;

  const navigate = useNavigate();

  const deleteTransaction = () => {
    callApi("deleting", () => transactionEndpoints.deleteTransaction(_id), {
      onSuccess: (res) => {
        onDelete();
        notify.error(res?.message || "Transaction deleted!");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error?.message
            : "Couldn't delete transaction!";
        notify.error(errorMessage);
      },
    });
  };

  return (
    <div className="p-3 flex flex-col gap-1 border rounded-md">
      <span>{account}</span>
      <span>{title}</span>
      <span>{description}</span>
      <span>{type}</span>
      <span>{category}</span>
      <span>{amount}</span>
      <span>{transferId}</span>
      <span>{note}</span>

      <CustomButton
        name="Edit"
        onClick={() => navigate(`${_id}/edit`)}
        disabled={loading?.deleting}
      />

      <CustomButton
        name="Delete"
        variant="red"
        onClick={deleteTransaction}
        loading={loading?.deleting}
      />
    </div>
  );
};

export default TransactionCard;
