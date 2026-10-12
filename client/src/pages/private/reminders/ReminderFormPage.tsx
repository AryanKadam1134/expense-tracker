import { useCallback, useEffect } from "react";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";

import { reminderEndpoints } from "../../../services/reminder.service";
import useApi from "../../../hooks/useApi";
import useReminderRepeats from "../../../hooks/useReminderRepeats";
import { useNotify } from "../../../context/notification";
import { formatDateInISO } from "../../../utils/formatDate";

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
        onError: (error) => {
          notify.error(
            error instanceof Error ? error.message : "Couldn't load reminder!",
          );
        },
      },
    );
  }, [callApi, reminderId, notify, reset]);

  const onSubmit: SubmitHandler<ReminderPayload> = (payload) => {
    const body = {
      ...payload,
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      repeat: payload.repeat || null,
    };

    if (reminderId) delete (body as Partial<ReminderPayload>).openingDue;

    callApi(
      "saving",
      () =>
        reminderId
          ? reminderEndpoints.updateReminder(body, reminderId)
          : reminderEndpoints.addReminder(body),
      {
        onSuccess: (response) => {
          notify.success(
            response.message ||
              (reminderId ? "Reminder updated!" : "Reminder created!"),
          );
          if (reminderId) fetchReminder();
          else navigate("/reminders");
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
    if (reminderId) fetchReminder();
  }, [fetchReminder, reminderId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
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

      <FormField
        id="openingDue"
        label="Opening due"
        required={!reminderId}
        error={errors.openingDue?.message}
      >
        <CustomInput
          id="openingDue"
          type="number"
          min="0.01"
          step="any"
          {...register("openingDue", {
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

      <FormField id="repeat" label="Repeat" error={errors.repeat?.message}>
        <Controller
          name="repeat"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="repeat"
              placeholder="Does not repeat"
              options={reminderRepeats}
              value={field.value}
              onChange={(value) => field.onChange(value || null)}
              disabled={loadingReminderRepeats}
            />
          )}
        />
      </FormField>

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
