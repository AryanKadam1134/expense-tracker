import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

import formatCurrency from "../utils/formatCurrency";

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
    bank,
    name: accountDisplayName,
    accountType,
    accountNumber,
    openingBalance,
    currentBalance,
  } = account;

  const { name: bankName } = bank || {};
  const formattedBalance = formatCurrency(currentBalance);

  const navigate = useNavigate();

  const deleteAccout = () => {
    callApi("deleting", () => accountEndpoints.deleteAccount(_id), {
      onSuccess: (res) => {
        onDelete();
        notify.success(res?.message || "Account deleted!");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error?.message : "Couldn't delete account!";
        notify.error(errorMessage);
      },
    });
  };

  return (
    <article className="group rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_5px_20px_rgba(23,43,36,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(23,43,36,0.08)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3ec] text-[#24533d]">
            <span className="text-lg font-semibold">
              {accountDisplayName?.slice(0, 1).toUpperCase() || "A"}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-light-text-primary">
                {accountDisplayName}
              </h2>
              {accountType && (
                <span className="rounded-full bg-light-bg-secondary px-2.5 py-1 text-[11px] font-medium capitalize text-light-text-secondary">
                  {accountType}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-light-text-secondary">
              {bankName || "Bank not available"}
              {accountNumber ? ` ···· ${accountNumber.slice(-4)}` : ""}
            </p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-light-text-tertiary">
              Current balance
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-[#174936]">
              {formattedBalance}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-light-border-primary pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <p className="text-xs text-light-text-tertiary">
            Opening balance{" "}
            <span className="ml-1 font-medium text-light-text-secondary">
              {formatCurrency(openingBalance)}
            </span>
          </p>
          <div className="flex gap-2">
            <CustomButton
              name="Edit"
              size="small"
              variant="green"
              onClick={() => navigate(`${_id}/edit`)}
              disabled={loading?.deleting}
            />
            <CustomButton
              name="Delete"
              size="small"
              variant="red"
              onClick={deleteAccout}
              loading={loading?.deleting}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default AccountCard;
