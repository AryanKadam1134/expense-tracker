import { useCallback, useEffect, useState } from "react";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";

import { formatDateInISO } from "../../../utils/formatDate";

import { transactionEndpoints } from "../../../services/transaction.service";

import useApi from "../../../hooks/useApi";
import useAccountOptions from "../../../hooks/useAccountOptions";
import useCategoryOptions from "../../../hooks/useCategoryOptions";
import useReminderOptions from "../../../hooks/useReminderOptions";
import useTransactionTypes from "../../../hooks/useTransactionTypes";

import { useNotify } from "../../../context/notification";

import type { TransactionPayload } from "../../../types/api.types";

const TransactionFormPage = () => {
  const { notify } = useNotify();

  const { transactionId } = useParams();
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    transactionLoading: true,
    creating: false,
  });
  const { loadingAccountOptions, accountOptions } = useAccountOptions();
  const { loadingCategoryOptions, categoryOptions } = useCategoryOptions();
  const { loadingReminderOptions, reminderOptions } = useReminderOptions();
  const { loadingTransactionTypes, transactionTypes } = useTransactionTypes();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionPayload>({
    mode: "onChange",
    defaultValues: { reminderId: null },
  });

  const selectedType = watch("type");
  const isCredit = selectedType === "credit";

  const [customCategory, setCustomCategory] = useState<boolean>(false);

  const fetchTransaction = useCallback(() => {
    if (!transactionId) return;

    callApi(
      "transactionLoading",
      () => transactionEndpoints.getTransaction(transactionId),
      {
        onSuccess: (res) => {
          const data = res.data;
          reset({ ...data, date: formatDateInISO(data.date) });
        },
      },
    );
  }, [callApi, transactionId, reset]);

  const onSubmit: SubmitHandler<TransactionPayload> = (payload) => {
    const requestPayload = {
      ...payload,
      reminderId:
        payload.type === "debit" ? payload.reminderId || null : null,
    };

    callApi(
      "creating",
      () =>
        transactionId
          ? transactionEndpoints.updateTransaction(
              requestPayload,
              transactionId,
            )
          : transactionEndpoints.addTransaction(requestPayload),
      {
        onSuccess: (res) => {
          notify.success(
            res?.message ||
              (transactionId ? "Transaction updated!" : "Transaction created!"),
          );

          navigate("/transactions");
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error?.message
              : transactionId
                ? "Couldn't update transaction!"
                : "Couldn't create transaction!";
          notify.error(errorMessage);
        },
      },
    );
  };

  useEffect(() => {
    if (!transactionId) return;
    fetchTransaction();
  }, [fetchTransaction, transactionId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      {/* Transaction Account */}
      <FormField
        id="accountId"
        label="Transaction Account"
        required
        error={errors?.accountId?.message}
      >
        <Controller
          name="accountId"
          control={control}
          rules={{ required: "Account is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="accountId"
              placeholder="Select"
              options={accountOptions}
              value={field?.value}
              onChange={field?.onChange}
              disabled={Boolean(transactionId) || loadingAccountOptions}
            />
          )}
        />
      </FormField>

      {/* Transaction Title */}
      <FormField
        id="title"
        label="Transaction Title"
        required
        error={errors?.title?.message}
      >
        <CustomInput
          id="title"
          type="text"
          placeholder=""
          {...register("title", {
            required: "Transaction title is required!",
          })}
        />
      </FormField>

      {/* Description */}
      <FormField
        id="description"
        label="Description"
        error={errors?.description?.message}
      >
        <CustomTextArea
          id="description"
          rows={4}
          placeholder=""
          {...register("description")}
        />
      </FormField>

      {/* Transaction Date */}
      <FormField
        id="date"
        label="Transaction Date"
        required
        error={errors?.date?.message}
      >
        <CustomDatePicker
          id="date"
          type="number"
          placeholder="Select"
          {...register("date", {
            required: "Transaction date is required!",
          })}
        />
      </FormField>

      {/* Transaction Type */}
      <FormField
        id="type"
        label="Transaction Type"
        required
        error={errors?.type?.message}
      >
        <Controller
          name="type"
          control={control}
          rules={{ required: "Transaction type is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="type"
              placeholder="Select"
              options={transactionTypes}
              value={field?.value}
              onChange={(value) => {
                field.onChange(value);
                if (value === "credit") setValue("reminderId", null);
              }}
              disabled={Boolean(transactionId) || loadingTransactionTypes}
            />
          )}
        />
      </FormField>

      {/* Reminder payment (debit only) */}
      <FormField id="reminderId" label="Pay reminder">
        <Controller
          name="reminderId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="reminderId"
              placeholder="No reminder"
              options={reminderOptions}
              value={field.value}
              onChange={(value) => field.onChange(value || null)}
              disabled={
                Boolean(transactionId) || isCredit || loadingReminderOptions
              }
            />
          )}
        />
      </FormField>

      {/* Custom Category Checkbox */}
      <button type="button" onClick={() => setCustomCategory((prev) => !prev)}>
        {customCategory ? "Custom Active" : "Custom Inactive"}
      </button>

      {/* Transaction Category */}
      {customCategory ? (
        <FormField
          id="categoryId"
          label="Custom Category"
          error={errors?.categoryId?.message}
        >
          <CustomInput
            id="categoryId"
            type="text"
            placeholder=""
            {...register("categoryId")}
          />
        </FormField>
      ) : (
        <FormField
          id="categoryId"
          label="Transaction Category"
          error={errors?.categoryId?.message}
        >
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                id="categoryId"
                placeholder="Select"
                options={categoryOptions}
                value={field?.value}
                onChange={field?.onChange}
                disabled={loadingCategoryOptions}
              />
            )}
          />
        </FormField>
      )}

      {/* Amount */}
      <FormField
        id="amount"
        label="Amount"
        required
        error={errors?.amount?.message}
      >
        <CustomInput
          id="amount"
          type="number"
          placeholder="3000"
          {...register("amount", {
            required: "Amount is required!",
            valueAsNumber: true,
          })}
          disabled={Boolean(transactionId)}
        />
      </FormField>

      {/* Note */}
      <FormField id="note" label="Note" error={errors?.note?.message}>
        <CustomTextArea
          id="note"
          rows={4}
          placeholder=""
          {...register("note")}
        />
      </FormField>

      {/* Submit */}
      <CustomButton
        type="submit"
        name={loading.creating ? "Saving..." : "Save"}
        className="w-fit col-span-2 justify-self-end"
        loading={loading.creating}
      />
    </form>
  );
};

export default TransactionFormPage;
