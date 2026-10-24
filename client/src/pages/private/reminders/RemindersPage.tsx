import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";

import ReminderCard from "../../../components/ReminderCard";
import PageHeader from "../../../components/common/PageHeader";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { reminderEndpoints } from "../../../services/reminder.service";

import useApi from "../../../hooks/useApi";

import type {
  PaginationData,
  PaginationParams,
  Reminder,
} from "../../../types/api.types";

const RemindersPage = () => {
  const { loading, callApi } = useApi({
    loadingReminders: false,
  });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchReminders = useCallback(() => {
    callApi("loadingReminders", () => reminderEndpoints.getReminders(params), {
      onSuccess: (res) => {
        setReminders(res.data.data);
        setPagination(res.data.pagination);
      },
    });
  }, [callApi, params]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Reminders"
        subHeading="Track upcoming payments and see what is still due."
      >
        <CustomButton
          name="Add Reminder"
          icon={BellRing}
          onClick={() => navigate("add")}
          className="w-fit"
        />
      </PageHeader>

      {loading.loadingReminders ? (
        <p className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading reminders...
        </p>
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
        <p className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No reminders yet. Add one to keep an upcoming payment in view.
        </p>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default RemindersPage;
