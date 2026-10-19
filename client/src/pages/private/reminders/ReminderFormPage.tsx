import { useCallback, useEffect } from "react";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";

import { formatDateInISO } from "../../../utils/formatDate";

import { reminderEndpoints } from "../../../services/reminder.service";

import useApi from "../../../hooks/useApi";
import useReminderRepeats from "../../../hooks/useReminderRepeats";

import { useNotify } from "../../../context/notification";

import type { ReminderPayload } from "../../../types/api.types";

const ReminderFormPage = () => {
  const { notify } = useNotify();

  const { reminderId } = useParams();
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    loadingReminder: false,
    saving: false,
  });
  const { loadingReminderRepeats, reminderRepeats } = useReminderRepeats();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReminderPayload>({ mode: "onChange" });

  const fetchReminder = useCallback(() => {
    if (!reminderId) return;

    callApi(
      "loadingReminder",
      () => reminderEndpoints.getReminder(reminderId),
      {
        onSuccess: (res) => {
          const { data } = res;
          reset({
            ...data,
            dueDate: formatDateInISO(data.dueDate),
          });
        },
      },
    );
  }, [callApi, reminderId, reset]);

  const onSubmit: SubmitHandler<ReminderPayload> = (payload) => {
    callApi(
      "saving",
      () =>
        reminderId
          ? reminderEndpoints.updateReminder(payload, reminderId)
          : reminderEndpoints.addReminder(payload),
      {
        onSuccess: (response) => {
          notify.success(
            response.message ||
              (reminderId ? "Reminder updated!" : "Reminder created!"),
          );

          navigate("/reminders");
        },
        onError: (error) => {
          notify.error(
            error instanceof Error
              ? error.message
              : reminderId
                ? "Couldn't update reminder!"
                : "Couldn't create reminder!",
          );
        },
      },
    );
  };

  useEffect(() => {
    fetchReminder();
  }, [fetchReminder]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      {/* Title */}
      <FormField
        id="title"
        label="Title"
        required
        error={errors.title?.message}
      >
        <CustomInput
          id="title"
          type="text"
          placeholder="e.g. Rent"
          {...register("title", { required: "Title is required!" })}
        />
      </FormField>

      {/* Opening due */}
      <FormField
        id="originalDue"
        label="Opening due"
        required={!reminderId}
        error={errors.originalDue?.message}
      >
        <CustomInput
          id="originalDue"
          type="number"
          min="0.01"
          step="any"
          {...register("originalDue", {
            ...(reminderId
              ? {}
              : {
                  required: "Opening due is required!",
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    "Opening due must be greater than 0!",
                }),
          })}
          disabled={Boolean(reminderId)}
        />
      </FormField>

      {/* Due date */}
      <FormField
        id="dueDate"
        label="Due date"
        required
        error={errors.dueDate?.message}
      >
        <CustomDatePicker
          id="dueDate"
          {...register("dueDate", { required: "Due date is required!" })}
        />
      </FormField>

      {/* Frequency */}
      <FormField
        id="frequency"
        label="Frequency"
        error={errors.frequency?.message}
      >
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="frequency"
              placeholder="Does not repeat"
              options={reminderRepeats}
              value={field.value}
              onChange={(value) => field.onChange(value || null)}
              disabled={loadingReminderRepeats}
            />
          )}
        />
      </FormField>

      {/* Description */}
      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
        className="col-span-2"
      >
        <CustomTextArea
          id="description"
          rows={4}
          placeholder="Optional details"
          {...register("description")}
        />
      </FormField>

      <div className="col-span-2 flex justify-end gap-2">
        <CustomButton
          type="button"
          name="Cancel"
          variant="green"
          onClick={() => navigate(-1)}
          disabled={loading.saving}
        />

        <CustomButton
          type="submit"
          name={loading.saving ? "Saving..." : "Save"}
          loading={loading.saving}
        />
      </div>
    </form>
  );
};

export default ReminderFormPage;
