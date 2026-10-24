import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, CalendarDays } from "lucide-react";

import CustomButton from "./ui/CustomButton";

import formatCurrency from "../utils/formatCurrency";
import { formatDateInAlphaNumeric } from "../utils/formatDate";

import { transactionEndpoints } from "../services/transaction.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { B2BTransfer } from "../types/api.types";

type Props = { transfer: B2BTransfer; onDelete: () => void };

const B2BTransferCard = ({ transfer, onDelete }: Props) => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { loading, callApi } = useApi({ deleting: false });
  const { debitTransaction: debit, creditTransaction: credit } = transfer;

  const deleteTransfer = () => {
    callApi(
      "deleting",
      () => transactionEndpoints.deleteB2BTransaction(transfer.transferId),
      {
        onSuccess: (res) => {
          onDelete();
          notify.success(res.message || "Transfer deleted!");
        },
        onError: (error) =>
          notify.error(
            error instanceof Error
              ? error.message
              : "Couldn't delete transfer!",
          ),
      },
    );
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1fa] text-[#4f6495]">
          <ArrowLeftRight size={21} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-semibold text-light-text-primary">
              {debit.title}
            </h2>
            {debit.category?.name && (
              <span className="rounded-full bg-light-bg-secondary px-2.5 py-1 text-[11px] font-medium text-light-text-secondary">
                {debit.category.name}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-light-text-secondary">
            {debit.account?.name ?? "Source account"}
            <span className="mx-2 text-light-text-tertiary">to</span>
            {credit.account?.name ?? "Destination account"}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-light-text-tertiary">
            <CalendarDays size={14} /> {formatDateInAlphaNumeric(debit.date)}
          </p>
          {debit.description && (
            <p className="mt-2 text-sm text-light-text-tertiary">
              {debit.description}
            </p>
          )}
          {debit.note && (
            <p className="mt-1 text-xs text-light-text-tertiary">
              {debit.note}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-light-border-primary pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p className="text-xl font-semibold tracking-tight text-light-text-primary">
          {formatCurrency(debit.amount)}
        </p>
        <div className="flex gap-2">
          <CustomButton
            name="Edit"
            size="small"
            variant="green"
            onClick={() => navigate(`${transfer.transferId}/edit`)}
            disabled={loading.deleting}
          />
          <CustomButton
            name="Delete"
            size="small"
            variant="red"
            onClick={deleteTransfer}
            loading={loading.deleting}
          />
        </div>
      </div>
    </article>
  );
};

export default B2BTransferCard;
