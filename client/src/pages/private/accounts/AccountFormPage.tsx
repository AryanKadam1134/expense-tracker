import { useCallback, useEffect } from "react";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";
import CustomSelect from "../../../components/ui/CustomSelect";

import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { accountEndpoints } from "../../../services/account.service";

import useApi from "../../../hooks/useApi";
import useBankOptions from "../../../hooks/useBankOptions";
import useAccountTypes from "../../../hooks/useAccountTypes";

import { useNotify } from "../../../context/notification";

import type { AccountPayload } from "../../../types/api.types";

const AccountFormPage = () => {
  const { notify } = useNotify();

  const { accountId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(accountId);

  const { loading, callApi } = useApi({
    accountLoading: true,
    saving: false,
  });
  const { loadingAccountTypes, accountTypes } = useAccountTypes();
  const { loadingBankOptions, bankOptions } = useBankOptions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<AccountPayload>({
    mode: "onChange",
  });

  const fetchAccount = useCallback(() => {
    if (!accountId) return;

    callApi("accountLoading", () => accountEndpoints.getAccount(accountId), {
      onSuccess: (res) => {
        reset(res.data);
      },
    });
  }, [callApi, accountId, reset]);

  const onSubmit: SubmitHandler<AccountPayload> = (payload) => {
    const updatePayload = getUpdatedFields(payload, dirtyFields);

    if (isEditing && Object.keys(updatePayload).length === 0) {
      notify.info("No changes to save.");
      return;
    }

    callApi(
      "saving",
      () =>
        isEditing && accountId
          ? accountEndpoints.updateAccount(accountId, updatePayload)
          : accountEndpoints.addAccount(payload),
      {
        onSuccess: (res) => {
          notify.success(
            res?.message ||
              (isEditing ? "Account updated!" : "Account created!"),
          );

          navigate("/accounts");
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error?.message
              : isEditing
                ? "Couldn't update account!"
                : "Couldn't create account!";
          notify.error(errorMessage);
        },
      },
    );
  };

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 rounded-3xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_10px_38px_rgba(23,43,36,0.05)] sm:grid-cols-2 sm:p-8"
    >
      <div className="col-span-full mb-1 border-b border-light-border-primary pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b8f76]">
          Account setup
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-light-text-primary">
          {isEditing ? "Update account details" : "Add an account"}
        </h1>
        <p className="mt-1 text-sm text-light-text-secondary">
          Organize the accounts you use to manage your money.
        </p>
      </div>
      {/* Bank Name */}
      <FormField
        id="bankId"
        label="Bank Name"
        required
        error={errors?.bankId?.message}
      >
        <Controller
          name="bankId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="bankId"
              placeholder="Select"
              options={bankOptions}
              value={field?.value}
              onChange={field?.onChange}
              disabled={loadingBankOptions}
            />
          )}
        />
      </FormField>

      {/* Account Name */}
      <FormField
        id="name"
        label="Account Name"
        required
        error={errors?.name?.message}
      >
        <CustomInput
          id="name"
          type="text"
          placeholder="Trading Account"
          {...register("name", {
            required: "Account name is required!",
          })}
        />
      </FormField>

      {/* Account Number */}
      <FormField
        id="accountNumber"
        label="Account Number"
        error={errors?.accountNumber?.message}
      >
        <CustomInput
          id="accountNumber"
          type="number"
          placeholder="*****7887"
          {...register("accountNumber")}
        />
      </FormField>

      {/* Account Type */}
      <FormField
        id="accountType"
        label="Account Type"
        error={errors?.accountType?.message}
      >
        <Controller
          name="accountType"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="accountType"
              placeholder="Select"
              options={accountTypes}
              value={field?.value}
              onChange={field?.onChange}
              disabled={loadingAccountTypes}
            />
          )}
        />
      </FormField>

      {/* Opening Balance */}
      <FormField
        id="openingBalance"
        label="Opening Balance"
        required
        error={errors?.openingBalance?.message}
      >
        <CustomInput
          id="openingBalance"
          type="number"
          placeholder="******"
          {...register("openingBalance", {
            required: "Opening balance is required!",
          })}
          disabled={isEditing}
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

export default AccountFormPage;
