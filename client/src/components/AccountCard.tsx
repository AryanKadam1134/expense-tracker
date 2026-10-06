import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

import { accountEndpoints } from "../services/account.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Account } from "../types/api.types";

type AccountCardsProps = {
  account: Account;
  onDelete: () => void;
};

const AccountCard = ({ account, onDelete }: AccountCardsProps) => {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ deleting: false });

  const {
    _id,
    bankName,
    accountName,
    accountType,
    accountNumber,
    openingBalance,
    currentBalance,
  } = account;

  const navigate = useNavigate();

  const deleteAccout = () => {
    callApi("deleting", () => accountEndpoints.deleteAccount(_id), {
      onSuccess: (res) => {
        onDelete();
        notify.error(res?.message || "Account deleted!");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error?.message : "Couldn't delete account!";
        notify.error(errorMessage);
      },
    });
  };

  return (
    <div className="p-3 flex flex-col gap-1 border rounded-md">
      <span>{bankName}</span>
      <span>{accountName}</span>
      <span>{accountType}</span>
      <span>{accountNumber}</span>
      <span>{openingBalance}</span>
      <span>{currentBalance}</span>

      <CustomButton
        name="Edit"
        onClick={() => navigate(`${_id}/edit`)}
        disabled={loading?.deleting}
      />

      <CustomButton
        name="Delete"
        variant="red"
        onClick={deleteAccout}
        loading={loading?.deleting}
      />
    </div>
  );
};

export default AccountCard;
