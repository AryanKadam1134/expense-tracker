import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useReminderOptions = () => {
  const { loading, callApi } = useApi({ loadingReminderOptions: false });
  const [reminderOptions, setReminderOptions] = useState<Filter[]>([]);

  const fetchReminderOptions = useCallback(() => {
    callApi("loadingReminderOptions", filterEndpoints.getReminderOptions, {
      onSuccess: (response) => setReminderOptions(response.data),
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchReminderOptions();
  }, [fetchReminderOptions]);

  return {
    loadingReminderOptions: loading.loadingReminderOptions,
    reminderOptions,
  };
};

export default useReminderOptions;
