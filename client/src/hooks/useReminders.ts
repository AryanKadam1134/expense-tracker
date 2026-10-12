import { useCallback, useEffect, useState } from "react";

import { reminderEndpoints } from "../services/reminder.service";

import useApi from "./useApi";

import type { Reminder } from "../types/api.types";

const useReminders = () => {
  const { loading, callApi } = useApi({
    loadingReminders: false,
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = useCallback(() => {
    callApi("loadingReminders", reminderEndpoints.getReminders, {
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
    setReminders,
    fetchReminders,
  };
};

export default useReminders;
