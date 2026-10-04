import { useCallback, useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";

import { accountEndpoints } from "../../../services/account.service";

import useApi from "../../../hooks/useApi";

import { useNotify } from "../../../context/notification";

import type { AccountPayload } from "../../../types/api.types";

const AccountFormPage = () => {
  const { notify } = useNotify();

  const { accountId } = useParams();

  const { loading, callApi } = useApi({
    accountLoading: true,
    creating: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountPayload>({
    mode: "onChange",
  });

  const fetchAccount = useCallback(() => {
    callApi("accountLoading", () => accountEndpoints.getAccount(accountId), {
      onSuccess: (res) => {
        reset(res.data);
      },
      onError: () => {},
    });
  }, [callApi, accountId, reset]);

  const onSubmit: SubmitHandler<AccountPayload> = (payload) => {
    callApi(
      "creating",
      () =>
        accountId
          ? accountEndpoints.updateAccount(payload, accountId)
          : accountEndpoints.addAccount(payload),
      {
        onSuccess: (res) => {
          reset();
          notify.success(
            res?.message || accountId ? "Account Updated" : "Account created!",
          );
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error?.message
              : accountId
                ? "Couldn't update account!"
                : "Couldn't create account!";
          notify.error(errorMessage);
        },
      },
    );
  };

  useEffect(() => {
    if (!accountId) return;
    fetchAccount();
  }, [fetchAccount, accountId]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 grid grid-cols-2 gap-6"
      >
        {/* Bank Name */}
        <FormField
          id="bankName"
          label="Bank Name"
          required
          error={errors?.bankName?.message}
        >
          <CustomInput
            id="bankName"
            type="text"
            placeholder="RBI"
            {...register("bankName", {
              required: "Bank name is required!",
            })}
          />
        </FormField>

        {/* Account Name */}
        <FormField
          id="accountName"
          label="Account Name"
          required
          error={errors?.accountName?.message}
        >
          <CustomInput
            id="accountName"
            type="text"
            placeholder="Trading Account"
            {...register("accountName", {
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
          <CustomInput
            id="accountType"
            type="text"
            placeholder="Select"
            {...register("accountType")}
          />
        </FormField>

        {/* Opening Balance */}
        {!accountId && (
          <FormField
            id="openingBalance"
            label="Opening Balance"
            required
            error={errors?.openingBalance?.message}
          >
            <CustomInput
              id="openingBalance"
              type="text"
              placeholder="******"
              {...register("openingBalance", {
                required: "Opening balance is required!",
              })}
            />
          </FormField>
        )}

        {/* Submit */}
        <CustomButton
          type="submit"
          name={loading.creating ? "Saving..." : "Save"}
          className="w-fit"
          loading={loading.creating}
        />
      </form>
    </div>
  );
};

export default AccountFormPage;
