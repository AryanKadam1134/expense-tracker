import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

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
    <article className="flex flex-col gap-2 rounded-md border border-light-border-primary p-4">
      <h2 className="font-medium">{debit.title}</h2>
      <p>
        {debit.account?.name ?? "Source account"} →{" "}
        {credit.account?.name ?? "Destination account"}
      </p>
      <p>Amount: {debit.amount}</p>
      <p>Date: {formatDateInAlphaNumeric(debit.date)}</p>
      {debit.category?.name && <p>Category: {debit.category.name}</p>}
      {debit.description && <p>{debit.description}</p>}
      {debit.note && <p>Note: {debit.note}</p>}
      <div className="flex gap-2">
        <CustomButton
          name="Edit"
          onClick={() => navigate(`${transfer.transferId}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          variant="red"
          onClick={deleteTransfer}
          loading={loading.deleting}
        />
      </div>
    </article>
  );
};

export default B2BTransferCard;
