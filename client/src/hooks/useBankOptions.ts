import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useBankOptions = () => {
  const { loading, callApi } = useApi({
    loadingBankOptions: false,
  });

  const [bankOptions, setBankOptions] = useState<Filter[]>();

  const fetchBankOptions = useCallback(() => {
    callApi("loadingBankOptions", filterEndpoints.getBanksOptions, {
      onSuccess: (res) => {
        setBankOptions(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchBankOptions();
  }, [fetchBankOptions]);

  return {
    loadingBankOptions: loading.loadingBankOptions,
    bankOptions,
    fetchBankOptions,
  };
};

export default useBankOptions;
