import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useCategoryOptions = () => {
  const { loading, callApi } = useApi({
    loadingCategoryOptions: false,
  });

  const [categoryOptions, setCategoryOptions] = useState<Filter[]>();

  const fetchCategoryOptions = useCallback(() => {
    callApi("loadingCategoryOptions", filterEndpoints.getCategoryOptions, {
      onSuccess: (res) => {
        setCategoryOptions(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchCategoryOptions();
  }, [fetchCategoryOptions]);

  return {
    loadingCategoryOptions: loading.loadingCategoryOptions,
    categoryOptions,
  };
};

export default useCategoryOptions;
