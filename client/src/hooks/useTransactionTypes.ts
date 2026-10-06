import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useTransactionTypes = () => {
  const { loading, callApi } = useApi({
    loadingTransactionTypes: false,
  });

  const [transactionTypes, setTransactionTypes] = useState<Filter[]>();

  const fetchTransactionTypes = useCallback(() => {
    callApi("loadingTransactionTypes", filterEndpoints.getTransactionTypes, {
      onSuccess: (res) => {
        setTransactionTypes(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchTransactionTypes();
  }, [fetchTransactionTypes]);

  return {
    loadingTransactionTypes: loading.loadingTransactionTypes,
    transactionTypes,
  };
};

export default useTransactionTypes;
