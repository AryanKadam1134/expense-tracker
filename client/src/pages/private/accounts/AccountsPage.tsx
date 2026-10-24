import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { SquareUserRound } from "lucide-react";

import AccountCard from "../../../components/AccountCard";
import PageHeader from "../../../components/common/PageHeader";

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
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Accounts"
        subHeading="Keep your balances and account details in one clear place."
      >
        <CustomButton
          name="Add Account"
          icon={SquareUserRound}
          onClick={() => navigate("add")}
          className="w-fit"
        />
      </PageHeader>

      {loading.accountsLoading ? (
        <div className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading accounts...
        </div>
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
        <div className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No accounts yet. Add an account to start keeping your balances
          organized.
        </div>
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
