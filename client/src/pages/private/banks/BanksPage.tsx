import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";

import BankCard from "../../../components/BankCard";

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
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Bank"
        icon={Landmark}
        onClick={() => navigate("add")}
        className="self-end w-fit"
      />

      {loading.banksLoading ? (
        <p>Loading banks...</p>
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
        <p>No banks yet.</p>
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
