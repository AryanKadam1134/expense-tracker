import { useCallback, useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";

import useApi from "../../../hooks/useApi";

import { bankEndpoints } from "../../../services/bank.service";

import { useNotify } from "../../../context/notification";

import type { BankPayload } from "../../../types/api.types";

const BankFormPage = () => {
  const { notify } = useNotify();

  const { bankId } = useParams();
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    bankLoading: false,
    saving: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankPayload>({ mode: "onChange" });

  const fetchBank = useCallback(() => {
    if (!bankId) return;

    callApi("bankLoading", () => bankEndpoints.getBank(bankId), {
      onSuccess: (res) => reset({ name: res.data.name }),
    });
  }, [callApi, bankId, reset]);

  const onSubmit: SubmitHandler<BankPayload> = (payload) => {
    const body = { name: payload.name.trim() };

    callApi(
      "saving",
      () =>
        bankId
          ? bankEndpoints.updateBank(body, bankId)
          : bankEndpoints.addBank(body),
      {
        onSuccess: (response) => {
          notify.success(
            response.message || (bankId ? "Bank updated!" : "Bank created!"),
          );

          navigate("/banks");
        },
        onError: (error) => {
          notify.error(
            error instanceof Error
              ? error.message
              : bankId
                ? "Couldn't update bank!"
                : "Couldn't create bank!",
          );
        },
      },
    );
  };

  useEffect(() => {
    fetchBank();
  }, [fetchBank]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid max-w-xl grid-cols-1 gap-6"
    >
      {/* Bank name */}
      <FormField
        id="name"
        label="Bank name"
        required
        error={errors.name?.message}
      >
        <CustomInput
          id="name"
          type="text"
          placeholder="e.g. SBI"
          {...register("name", {
            required: "Bank name is required!",
            validate: (value) =>
              value.trim().length > 0 || "Bank name is required!",
          })}
        />
      </FormField>

      <div className="flex justify-end gap-2">
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

export default BankFormPage;
