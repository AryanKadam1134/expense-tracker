import { useCallback, useEffect, useState } from "react";

import useApi from "../../../hooks/useApi";

import { accountEndpoints } from "../../../services/account.service";

import type { Account } from "../../../types/api.types";
import CustomButton from "../../../components/ui/CustomButton";
import { useNavigate } from "react-router-dom";

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

  if (loading.accountsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        {accounts?.map((account) => {
          const { _id, bankName, accountName, openingBalance, currentBalance } =
            account || {};

          return (
            <div
              key={_id}
              className="p-3 flex flex-col gap-1 border rounded-md"
            >
              <span>{bankName}</span>
              <span>{accountName}</span>
              <span>{openingBalance}</span>
              <span>{currentBalance}</span>

              <CustomButton
                name="Edit"
                onClick={() => navigate(`${_id}/edit`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsPage;
