import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { SquareUserRound } from "lucide-react";

import AccountCard from "../../../components/AccountCard";

import CustomButton from "../../../components/ui/CustomButton";

import { accountEndpoints } from "../../../services/account.service";

import useApi from "../../../hooks/useApi";

import type { Account } from "../../../types/api.types";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const { loading, callApi } = useApi({ accountsLoading: false });

  const navigate = useNavigate();

  const fetchAccounts = useCallback(() => {
    callApi("accountsLoading", accountEndpoints.getAccounts, {
      onSuccess: (res) => {
        setAccounts(res.data);
      },
    });
  }, [callApi]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Account"
        icon={SquareUserRound}
        onClick={() => navigate("add")}
        className="self-end w-fit"
      />

      {loading.accountsLoading ? (
        <div>Loading accounts...</div>
      ) : accounts?.length ? (
        accounts?.map((account) => (
          <AccountCard
            key={account?._id}
            account={account}
            onDelete={() =>
              setAccounts((prev) =>
                prev.filter((item) => item._id !== account?._id),
              )
            }
          />
        ))
      ) : (
        <div>No accounts yet.</div>
      )}
    </div>
  );
};

export default AccountsPage;
