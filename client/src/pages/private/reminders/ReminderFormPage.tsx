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
import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { reminderEndpoints } from "../../../services/reminder.service";

import useApi from "../../../hooks/useApi";
import useReminderRepeats from "../../../hooks/useReminderRepeats";

import { useNotify } from "../../../context/notification";

import type { ReminderPayload } from "../../../types/api.types";

const ReminderFormPage = () => {
  const { notify } = useNotify();

  const { reminderId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(reminderId);

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
    formState: { errors, dirtyFields },
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
    const updatePayload = getUpdatedFields(payload, dirtyFields);

    if (isEditing && Object.keys(updatePayload).length === 0) {
      notify.info("No changes to save.");
      return;
    }

    callApi(
      "saving",
      () =>
        isEditing && reminderId
          ? reminderEndpoints.updateReminder(reminderId, updatePayload)
          : reminderEndpoints.addReminder(payload),
      {
        onSuccess: (response) => {
          notify.success(
            response.message ||
              (isEditing ? "Reminder updated!" : "Reminder created!"),
          );

          navigate("/reminders");
        },
        onError: (error) => {
          notify.error(
            error instanceof Error
              ? error.message
              : isEditing
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 rounded-3xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_10px_38px_rgba(23,43,36,0.05)] sm:grid-cols-2 sm:p-8"
    >
      <div className="col-span-full mb-1 border-b border-light-border-primary pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b8f76]">
          Payment planning
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-light-text-primary">
          {isEditing ? "Edit reminder" : "Add a reminder"}
        </h1>
        <p className="mt-1 text-sm text-light-text-secondary">
          Keep track of a due amount and when it needs attention.
        </p>
      </div>
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
        required={!isEditing}
        error={errors.originalDue?.message}
      >
        <CustomInput
          id="originalDue"
          type="number"
          min="0.01"
          step="any"
          {...register("originalDue", {
            ...(isEditing
              ? {}
              : {
                  required: "Opening due is required!",
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    "Opening due must be greater than 0!",
                }),
          })}
          disabled={isEditing}
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
        className="col-span-full"
      >
        <CustomTextArea
          id="description"
          rows={4}
          placeholder="Optional details"
          {...register("description")}
        />
      </FormField>

      <div className="col-span-full flex justify-end gap-2">
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
