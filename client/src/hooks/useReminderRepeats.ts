import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";

import type { Filter } from "../types/api.types";

const useReminderRepeats = () => {
  const { loading, callApi } = useApi({ loadingReminderRepeats: false });
  const [reminderRepeats, setReminderRepeats] = useState<Filter[]>([]);

  const fetchReminderRepeats = useCallback(() => {
    callApi("loadingReminderRepeats", filterEndpoints.getReminderRepeats, {
      onSuccess: (response) => setReminderRepeats(response.data),
      onError: () => {},
    });
  }, [callApi]);

  useEffect(() => {
    fetchReminderRepeats();
  }, [fetchReminderRepeats]);

  return {
    loadingReminderRepeats: loading.loadingReminderRepeats,
    reminderRepeats,
  };
};

export default useReminderRepeats;
