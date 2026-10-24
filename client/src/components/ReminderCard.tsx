import { useNavigate } from "react-router-dom";
import { BellRing, CalendarClock } from "lucide-react";

import CustomButton from "./ui/CustomButton";

import formatCurrency from "../utils/formatCurrency";
import { formatDateInAlphaNumeric } from "../utils/formatDate";

import { reminderEndpoints } from "../services/reminder.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Reminder } from "../types/api.types";

type ReminderCardProps = {
  reminder: Reminder;
  onDelete: () => void;
};

const ReminderCard = ({ reminder, onDelete }: ReminderCardProps) => {
  const { notify } = useNotify();
  const { loading, callApi } = useApi({ deleting: false });
  const navigate = useNavigate();

  const paidAmount = Math.max(reminder.originalDue - reminder.remainingDue, 0);
  const paidPercent =
    reminder.originalDue > 0
      ? Math.min((paidAmount / reminder.originalDue) * 100, 100)
      : 0;

  const deleteReminder = () => {
    callApi("deleting", () => reminderEndpoints.deleteReminder(reminder._id), {
      onSuccess: (response) => {
        onDelete();
        notify.success(response.message || "Reminder deleted!");
      },
      onError: (error) =>
        notify.error(
          error instanceof Error ? error.message : "Couldn't delete reminder!",
        ),
    });
  };

  return (
    <article className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#9a6820]">
            <BellRing size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-semibold text-light-text-primary">
                {reminder.title}
              </h2>
              {reminder.isPaid && (
                <span className="rounded-full bg-[#eaf3ec] px-2.5 py-1 text-[11px] font-semibold text-[#286247]">
                  Paid
                </span>
              )}
            </div>
            {reminder.description && (
              <p className="mt-1 truncate text-sm text-light-text-secondary">
                {reminder.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-light-text-tertiary">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock size={14} /> Due{" "}
                {formatDateInAlphaNumeric(reminder.dueDate)}
              </span>
              {reminder.frequency && (
                <span className="capitalize">Repeats {reminder.frequency}</span>
              )}
            </div>
            <div className="mt-4 max-w-md">
              <div className="mb-1.5 flex justify-between gap-3 text-xs">
                <span className="text-light-text-tertiary">
                  Paid {formatCurrency(paidAmount)}
                </span>
                <span className="font-medium text-light-text-secondary">
                  {formatCurrency(reminder.remainingDue)} remaining
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-light-bg-tertiary">
                <div
                  className="h-full rounded-full bg-[#68a67a] transition-all"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 border-t border-light-border-primary pt-4 sm:flex-col sm:border-0 sm:pt-0">
          <CustomButton
            name="Edit"
            size="small"
            variant="green"
            onClick={() => navigate(`${reminder._id}/edit`)}
            disabled={loading.deleting}
          />
          <CustomButton
            name="Delete"
            size="small"
            variant="red"
            onClick={deleteReminder}
            loading={loading.deleting}
          />
        </div>
      </div>
    </article>
  );
};

export default ReminderCard;
