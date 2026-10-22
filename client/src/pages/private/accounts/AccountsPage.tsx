import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { SquareUserRound } from "lucide-react";

import AccountCard from "../../../components/AccountCard";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { accountEndpoints } from "../../../services/account.service";

import useApi from "../../../hooks/useApi";

import type {
  PaginationData,
  Account,
  PaginationParams,
} from "../../../types/api.types";

const AccountsPage = () => {
  const { loading, callApi } = useApi({ accountsLoading: false });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchAccounts = useCallback(() => {
    callApi("accountsLoading", () => accountEndpoints.getAccounts(params), {
      onSuccess: (res) => {
        const { data } = res;
        setAccounts(data?.data);
        setPagination(data?.pagination);
      },
    });
  }, [callApi, params]);

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

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
      />
    </div>
  );
};

export default AccountsPage;
