import { useCallback, useEffect, useState } from "react";

import { filterEndpoints } from "../services/filter.service";

import useApi from "./useApi";
import formatCurrency from "../utils/formatCurrency";

import type { ReminderOption } from "../types/api.types";

const useReminderOptions = () => {
  const { loading, callApi } = useApi({ loadingReminderOptions: false });
  const [reminderOptions, setReminderOptions] = useState<ReminderOption[]>([]);

  const fetchReminderOptions = useCallback(() => {
    callApi("loadingReminderOptions", filterEndpoints.getReminderOptions, {
      onSuccess: (response) =>
        setReminderOptions(
          response.data.map((reminder) => ({
            ...reminder,
            label: `${reminder.label} - ${formatCurrency(reminder.remainingDue)} due`,
          })),
        ),
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
