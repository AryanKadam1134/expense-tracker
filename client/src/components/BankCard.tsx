import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

import { bankEndpoints } from "../services/bank.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Bank } from "../types/api.types";

type BankCardProps = {
  bank: Bank;
  onDelete: () => void;
};

const BankCard = ({ bank, onDelete }: BankCardProps) => {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ deleting: false });

  const navigate = useNavigate();

  const deleteBank = () => {
    callApi("deleting", () => bankEndpoints.deleteBank(bank._id), {
      onSuccess: (response) => {
        onDelete();
        notify.success(response.message || "Bank deleted!");
      },
      onError: (error) => {
        notify.error(
          error instanceof Error ? error.message : "Couldn't delete bank!",
        );
      },
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-light-border-primary p-3">
      <span className="min-w-0 truncate">{bank.name}</span>

      <div className="flex shrink-0 gap-2">
        <CustomButton
          name="Edit"
          onClick={() => navigate(`${bank._id}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          variant="red"
          onClick={deleteBank}
          loading={loading.deleting}
        />
      </div>
    </div>
  );
};

export default BankCard;
