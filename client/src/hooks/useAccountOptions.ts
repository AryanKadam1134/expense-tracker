import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useAccountOptions = () => {
  const { loading, callApi } = useApi({
    loadingAccountOptions: false,
  });

  const [accountOptions, setAccountOptions] = useState<Filter[]>();

  const fetchAccountOptions = useCallback(() => {
    callApi("loadingAccountOptions", filterEndpoints.getAccountOptions, {
      onSuccess: (res) => {
        setAccountOptions(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchAccountOptions();
  }, [fetchAccountOptions]);

  return {
    loadingAccountOptions: loading.loadingAccountOptions,
    accountOptions,
  };
};

export default useAccountOptions;
