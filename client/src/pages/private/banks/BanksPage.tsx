import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";

import BankCard from "../../../components/BankCard";
import PageHeader from "../../../components/common/PageHeader";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { bankEndpoints } from "../../../services/bank.service";

import useApi from "../../../hooks/useApi";

import type {
  Bank,
  PaginationData,
  PaginationParams,
} from "../../../types/api.types";

const BanksPage = () => {
  const { loading, callApi } = useApi({ banksLoading: false });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchBanks = useCallback(() => {
    callApi("banksLoading", () => bankEndpoints.getBanks(params), {
      onSuccess: (res) => {
        setBanks(res.data.data);
        setPagination(res.data.pagination);
      },
    });
  }, [callApi, params]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Banks"
        subHeading="Organize the financial institutions connected to your accounts."
      >
        <CustomButton
          name="Add Bank"
          icon={Landmark}
          onClick={() => navigate("add")}
          className="w-fit"
        />
      </PageHeader>

      {loading.banksLoading ? (
        <p className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading banks...
        </p>
      ) : banks.length ? (
        banks.map((bank) => (
          <BankCard
            key={bank._id}
            bank={bank}
            onDelete={() =>
              setBanks((current) =>
                current.filter((item) => item._id !== bank._id),
              )
            }
          />
        ))
      ) : (
        <p className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No banks yet. Add a bank to organize your accounts.
        </p>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default BanksPage;
