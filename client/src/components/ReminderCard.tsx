import { useNavigate } from "react-router-dom";

import CustomButton from "./ui/CustomButton";

import { reminderEndpoints } from "../services/reminder.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import { formatDateInAlphaNumeric } from "../utils/formatDate";

import type { Reminder } from "../types/api.types";

type ReminderCardProps = {
  reminder: Reminder;
  onDelete: () => void;
};

const ReminderCard = ({ reminder, onDelete }: ReminderCardProps) => {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ deleting: false });

  const navigate = useNavigate();

  const deleteReminder = () => {
    callApi("deleting", () => reminderEndpoints.deleteReminder(reminder._id), {
      onSuccess: (response) => {
        onDelete();
        notify.success(response.message || "Reminder deleted!");
      },
      onError: (error) => {
        notify.error(
          error instanceof Error ? error.message : "Couldn't delete reminder!",
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-light-border-primary p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{reminder.title}</span>
        {reminder.description && (
          <span className="truncate text-sm text-light-text-secondary">
            {reminder.description}
          </span>
        )}
        <span className="text-sm">
          Due {formatDateInAlphaNumeric(reminder.dueDate)} · Remaining:{" "}
          {reminder.remainingDue}
          {reminder.frequency ? ` · ${reminder.frequency}` : ""}
        </span>
      </div>

      <div className="flex shrink-0 gap-2">
        <CustomButton
          name="Edit"
          onClick={() => navigate(`${reminder._id}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          variant="red"
          onClick={deleteReminder}
          loading={loading.deleting}
        />
      </div>
    </div>
  );
};

export default ReminderCard;
