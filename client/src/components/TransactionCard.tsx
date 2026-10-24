import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, CalendarDays } from "lucide-react";

import CustomButton from "./ui/CustomButton";

import formatCurrency from "../utils/formatCurrency";
import { formatDateInAlphaNumeric } from "../utils/formatDate";

import { transactionEndpoints } from "../services/transaction.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Transaction } from "../types/api.types";

type TransactionCardProps = {
  transaction: Transaction;
  onDelete: () => void;
};

const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const { notify } = useNotify();
  const { loading, callApi } = useApi({ deleting: false });
  const navigate = useNavigate();

  const isCredit = transaction.type === "credit";
  const MovementIcon = isCredit ? ArrowDownLeft : ArrowUpRight;

  const deleteTransaction = () => {
    callApi(
      "deleting",
      () => transactionEndpoints.deleteTransaction(transaction._id),
      {
        onSuccess: (res) => {
          onDelete();
          notify.success(res.message || "Transaction deleted!");
        },
        onError: (error) =>
          notify.error(
            error instanceof Error
              ? error.message
              : "Couldn't delete transaction!",
          ),
      },
    );
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${isCredit ? "bg-[#e8f4ed] text-[#27804f]" : "bg-[#fff0ed] text-[#c45a48]"}`}
        >
          <MovementIcon size={21} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-semibold text-light-text-primary">
              {transaction.title}
            </h2>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${isCredit ? "bg-[#e8f4ed] text-[#27804f]" : "bg-[#fff0ed] text-[#b64e3d]"}`}
            >
              {transaction.type}
            </span>
            {transaction.category?.name && (
              <span className="rounded-full bg-light-bg-secondary px-2.5 py-1 text-[11px] font-medium text-light-text-secondary">
                {transaction.category.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-light-text-secondary">
            {transaction.account?.name || "Account"}
          </p>
          {transaction.description && (
            <p className="mt-2 line-clamp-2 text-sm text-light-text-tertiary">
              {transaction.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-light-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />{" "}
              {formatDateInAlphaNumeric(transaction.date)}
            </span>
            {transaction.note && (
              <span className="max-w-xs truncate">{transaction.note}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-light-border-primary pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p
          className={`text-xl font-semibold tracking-tight ${isCredit ? "text-[#27804f]" : "text-light-text-primary"}`}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex gap-2">
          <CustomButton
            name="Edit"
            size="small"
            variant="green"
            onClick={() => navigate(`${transaction._id}/edit`)}
            disabled={loading.deleting}
          />
          <CustomButton
            name="Delete"
            size="small"
            variant="red"
            onClick={deleteTransaction}
            loading={loading.deleting}
          />
        </div>
      </div>
    </article>
  );
};

export default TransactionCard;
