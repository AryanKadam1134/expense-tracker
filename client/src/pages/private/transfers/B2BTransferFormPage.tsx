import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import CustomButton from "../../../components/ui/CustomButton";
import CustomDatePicker from "../../../components/ui/CustomDatePicker";
import CustomInput from "../../../components/ui/CustomInput";
import CustomSelect from "../../../components/ui/CustomSelect";
import CustomTextArea from "../../../components/ui/CustomTextArea";
import FormField from "../../../components/ui/FormField";
import { useNotify } from "../../../context/notification";
import useAccountOptions from "../../../hooks/useAccountOptions";
import useApi from "../../../hooks/useApi";
import useCategoryOptions from "../../../hooks/useCategoryOptions";
import { transactionEndpoints } from "../../../services/transaction.service";
import type {
  B2BTransactionPayload,
  B2BTransactionUpdatePayload,
} from "../../../types/api.types";
import { formatDateInISO } from "../../../utils/formatDate";

const B2BTransferFormPage = () => {
  const { transferId } = useParams();
  const isEditing = Boolean(transferId);
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { loading, callApi } = useApi({
    loadingTransfer: isEditing,
    saving: false,
  });
  const { loadingAccountOptions, accountOptions } = useAccountOptions();
  const { loadingCategoryOptions, categoryOptions } = useCategoryOptions();
  const [customCategory, setCustomCategory] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<B2BTransactionPayload>({
    mode: "onChange",
    defaultValues: {
      title: "",
      date: "",
      amount: 0,
      description: "",
      note: "",
      categoryId: "",
    },
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

  useEffect(() => {
    fetchTransfer();
  }, [fetchTransfer]);

  const onSubmit: SubmitHandler<B2BTransactionPayload> = (payload) => {
    if (isEditing && transferId) {
      const updatePayload: B2BTransactionUpdatePayload = {
        title: payload.title,
        description: payload.description,
        date: payload.date,
        categoryId: payload.categoryId || null,
        note: payload.note,
      };

      callApi(
        "saving",
        () =>
          transactionEndpoints.updateB2BTransaction(transferId, updatePayload),
        {
          onSuccess: (res) => {
            notify.success(res.message || "Transfer updated!");
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
      return;
    }

    callApi(
      "saving",
      () =>
        transactionEndpoints.addB2BTransaction({
          ...payload,
          categoryId: payload.categoryId || null,
        }),
      {
        onSuccess: (res) => {
          notify.success(res.message || "Transfer created!");
          navigate("/transfers");
        },
        onError: (error) =>
          notify.error(
            error instanceof Error
              ? error.message
              : "Couldn't create transfer!",
          ),
      },
    );
  };

  if (loading.loadingTransfer) return <p>Loading transfer...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
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
      <FormField id="date" label="Date" required error={errors.date?.message}>
        <CustomDatePicker
          id="date"
          {...register("date", { required: "Date is required!" })}
        />
      </FormField>
      <div className="flex items-end pb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={customCategory}
            onChange={(event) => setCustomCategory(event.target.checked)}
          />
          Enter a new category
        </label>
      </div>
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
      <FormField id="note" label="Note" error={errors.note?.message}>
        <CustomTextArea id="note" rows={3} {...register("note")} />
      </FormField>
      <div className="col-span-2 flex justify-end gap-2">
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
