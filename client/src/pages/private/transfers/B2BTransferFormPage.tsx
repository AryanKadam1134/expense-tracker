import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomButton from "../../../components/ui/CustomButton";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import CustomCheckbox from "../../../components/ui/CustomCheckbox";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";

import { formatDateInISO } from "../../../utils/formatDate";
import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { transactionEndpoints } from "../../../services/transaction.service";

import useApi from "../../../hooks/useApi";
import useAccountOptions from "../../../hooks/useAccountOptions";
import useCategoryOptions from "../../../hooks/useCategoryOptions";

import { useNotify } from "../../../context/notification";

import type { B2BTransactionPayload } from "../../../types/api.types";

const B2BTransferFormPage = () => {
  const { notify } = useNotify();

  const { transferId } = useParams();
  const isEditing = Boolean(transferId);
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    loadingTransfer: isEditing,
    saving: false,
  });
  const { loadingAccountOptions, accountOptions } = useAccountOptions();
  const { loadingCategoryOptions, categoryOptions } = useCategoryOptions();

  const [customCategory, setCustomCategory] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<B2BTransactionPayload>({
    mode: "onChange",
  });

  const debitAccountId = watch("debitAccountId");

  const fetchTransfer = useCallback(() => {
    if (!transferId) return;

    callApi(
      "loadingTransfer",
      () => transactionEndpoints.getB2BTransaction(transferId),
      {
        onSuccess: ({ data }) =>
          reset({
            debitAccountId: data.debitTransaction.accountId,
            creditAccountId: data.creditTransaction.accountId,
            title: data.debitTransaction.title,
            description: data.debitTransaction.description ?? "",
            date: formatDateInISO(data.debitTransaction.date),
            categoryId: data.debitTransaction.categoryId ?? "",
            amount: data.debitTransaction.amount,
            note: data.debitTransaction.note ?? "",
          }),
        onError: (error) => {
          notify.error(
            error instanceof Error ? error.message : "Couldn't load transfer!",
          );
          navigate("/transfers");
        },
      },
    );
  }, [callApi, transferId, reset, notify, navigate]);

  const onSubmit: SubmitHandler<B2BTransactionPayload> = (payload) => {
    const requestPayload: B2BTransactionPayload = {
      ...payload,
      categoryId: payload.categoryId || null,
    };

    const updatePayload = getUpdatedFields(
      {
        title: payload.title,
        description: payload.description,
        date: payload.date,
        categoryId: payload.categoryId,
        note: payload.note,
      },
      {
        title: dirtyFields.title,
        description: dirtyFields.description,
        date: dirtyFields.date,
        categoryId: dirtyFields.categoryId,
        note: dirtyFields.note,
      },
    );

    if (isEditing && Object.keys(updatePayload).length === 0) {
      notify.info("No changes to save.");
      return;
    }

    callApi(
      "saving",
      () =>
        isEditing && transferId
          ? transactionEndpoints.updateB2BTransaction(transferId, updatePayload)
          : transactionEndpoints.addB2BTransaction(requestPayload),
      {
        onSuccess: (res) => {
          notify.success(
            res.message ||
              (isEditing ? "Transfer updated!" : "Transfer created!"),
          );

          navigate("/transfers");
        },
        onError: (error) =>
          notify.error(
            error instanceof Error
              ? error.message
              : "Couldn't update transfer!",
          ),
      },
    );
  };

  useEffect(() => {
    fetchTransfer();
  }, [fetchTransfer]);

  if (loading.loadingTransfer) return <p>Loading transfer...</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 rounded-3xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_10px_38px_rgba(23,43,36,0.05)] sm:grid-cols-2 sm:p-8"
    >
      <div className="col-span-full mb-1 border-b border-light-border-primary pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b8f76]">
          Between your accounts
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-light-text-primary">
          {isEditing ? "Edit transfer" : "Add a transfer"}
        </h1>
        <p className="mt-1 text-sm text-light-text-secondary">
          Keep both sides of a transfer connected as money moves between
          accounts.
        </p>
      </div>
      {/* From account */}
      <FormField
        id="debitAccountId"
        label="From account"
        required
        error={errors.debitAccountId?.message}
      >
        <Controller
          name="debitAccountId"
          control={control}
          rules={{ required: "Source account is required!" }}
          render={({ field }) => (
            <CustomSelect
              id="debitAccountId"
              placeholder="Select account"
              options={accountOptions}
              value={field.value}
              onChange={field.onChange}
              disabled={isEditing || loadingAccountOptions}
            />
          )}
        />
      </FormField>

      {/* To account */}
      <FormField
        id="creditAccountId"
        label="To account"
        required
        error={errors.creditAccountId?.message}
      >
        <Controller
          name="creditAccountId"
          control={control}
          rules={{
            required: "Destination account is required!",
            validate: (value) =>
              value !== debitAccountId ||
              "Choose a different destination account!",
          }}
          render={({ field }) => (
            <CustomSelect
              id="creditAccountId"
              placeholder="Select account"
              options={accountOptions}
              value={field.value}
              onChange={field.onChange}
              disabled={isEditing || loadingAccountOptions}
            />
          )}
        />
      </FormField>

      {/* Title */}
      <FormField
        id="title"
        label="Title"
        required
        error={errors.title?.message}
      >
        <CustomInput
          id="title"
          {...register("title", { required: "Title is required!" })}
        />
      </FormField>

      {/* Amount */}
      <FormField
        id="amount"
        label="Amount"
        required
        error={errors.amount?.message}
      >
        <CustomInput
          id="amount"
          type="number"
          {...register("amount", {
            required: "Amount is required!",
            valueAsNumber: true,
            min: { value: 0.01, message: "Amount must be greater than zero!" },
          })}
          disabled={isEditing}
        />
      </FormField>

      {/* Date */}
      <FormField id="date" label="Date" required error={errors.date?.message}>
        <CustomDatePicker
          id="date"
          {...register("date", { required: "Date is required!" })}
        />
      </FormField>

      <FormField id="checkbox" label="Enter a new category" type="checkbox">
        <CustomCheckbox
          id="checkbox"
          checked={customCategory}
          onChange={(event) => setCustomCategory(event.target.checked)}
        />
      </FormField>

      {/* Category */}
      <FormField
        id="categoryId"
        label={customCategory ? "New category" : "Category"}
        error={errors.categoryId?.message}
      >
        {customCategory ? (
          <CustomInput
            id="categoryId"
            {...register("categoryId")}
            disabled={loadingCategoryOptions}
          />
        ) : (
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                id="categoryId"
                placeholder="No category"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={loadingCategoryOptions}
              />
            )}
          />
        )}
      </FormField>

      {/* Description */}
      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
      >
        <CustomTextArea
          id="description"
          rows={3}
          {...register("description")}
        />
      </FormField>

      {/* Note */}
      <FormField id="note" label="Note" error={errors.note?.message}>
        <CustomTextArea id="note" rows={3} {...register("note")} />
      </FormField>

      <div className="col-span-full flex justify-end gap-2">
        <CustomButton
          type="button"
          name="Cancel"
          variant="green"
          onClick={() => navigate("/transfers")}
        />

        <CustomButton
          type="submit"
          name={loading.saving ? "Saving..." : "Save transfer"}
          loading={loading.saving}
        />
      </div>
    </form>
  );
};

export default B2BTransferFormPage;
