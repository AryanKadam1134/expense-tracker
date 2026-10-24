import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";

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
    <article className="flex flex-col gap-4 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3ec] text-[#24533d]">
          <Landmark size={21} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-light-text-tertiary">
            Financial institution
          </p>
          <h2 className="mt-1 truncate text-base font-semibold text-light-text-primary">
            {bank.name}
          </h2>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t border-light-border-primary pt-4 sm:border-0 sm:pt-0">
        <CustomButton
          name="Edit"
          size="small"
          variant="green"
          onClick={() => navigate(`${bank._id}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          size="small"
          variant="red"
          onClick={deleteBank}
          loading={loading.deleting}
        />
      </div>
    </article>
  );
};

export default BankCard;
