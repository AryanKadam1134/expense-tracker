import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useAccountTypes = () => {
  const { loading, callApi } = useApi({
    loadingAccountTypes: false,
  });

  const [accountTypes, setAccountTypes] = useState<Filter[]>();

  const fetchAccountTypes = useCallback(() => {
    callApi("loadingAccountTypes", filterEndpoints.getAccountTypes, {
      onSuccess: (res) => {
        setAccountTypes(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchAccountTypes();
  }, [fetchAccountTypes]);

  return { loadingAccountTypes: loading.loadingAccountTypes, accountTypes };
};

export default useAccountTypes;
