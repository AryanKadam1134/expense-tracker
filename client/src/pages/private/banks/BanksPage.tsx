import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";

import BankCard from "../../../components/BankCard";

import CustomButton from "../../../components/ui/CustomButton";

import { bankEndpoints } from "../../../services/bank.service";

import useApi from "../../../hooks/useApi";

import type { Bank } from "../../../types/api.types";

const BanksPage = () => {
  const [banks, setBanks] = useState<Bank[]>([]);

  const { loading, callApi } = useApi({ banksLoading: false });

  const navigate = useNavigate();

  const fetchBanks = useCallback(() => {
    callApi("banksLoading", bankEndpoints.getBanks, {
      onSuccess: (res) => setBanks(res.data),
    });
  }, [callApi]);

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
    </div>
  );
};

export default BanksPage;
