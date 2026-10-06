import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useReminders = () => {
  const { loading, callApi } = useApi({
    loadingReminders: false,
  });

  const [reminders, setReminders] = useState<Filter[]>();

  const fetchReminders = useCallback(() => {
    callApi("loadingReminders", filterEndpoints.getReminders, {
      onSuccess: (res) => {
        setReminders(res.data);
      },
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return {
    loadingReminders: loading.loadingReminders,
    reminders,
  };
};

export default useReminders;
