import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";

import ReminderCard from "../../../components/ReminderCard";

import CustomButton from "../../../components/ui/CustomButton";

import { reminderEndpoints } from "../../../services/reminder.service";

import useApi from "../../../hooks/useApi";

import type { Reminder } from "../../../types/api.types";

const RemindersPage = () => {
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    loadingReminders: false,
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = useCallback(() => {
    callApi("loadingReminders", reminderEndpoints.getReminders, {
      onSuccess: (res) => {
        setReminders(res.data);
      },
    });
  }, [callApi]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Reminder"
        icon={BellRing}
        onClick={() => navigate("add")}
        className="w-fit self-end"
      />

      {loading.loadingReminders ? (
        <p>Loading reminders...</p>
      ) : reminders.length ? (
        reminders.map((reminder) => (
          <ReminderCard
            key={reminder._id}
            reminder={reminder}
            onDelete={() =>
              setReminders((current) =>
                current.filter((item) => item._id !== reminder._id),
              )
            }
          />
        ))
      ) : (
        <p>No reminders yet.</p>
      )}
    </div>
  );
};

export default RemindersPage;
