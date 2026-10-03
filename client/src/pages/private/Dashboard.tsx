import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/auth";
import type { AccountPayload } from "../../types/api.types";
import FormField from "../../components/ui/FormField";
import CustomInput from "../../components/ui/CustomInput";
import useApi from "../../hooks/useApi";
import { accountEndpoints } from "../../services/account.service";
import { useNotify } from "../../context/notification";
import CustomButton from "../../components/ui/CustomButton";

const Dashboard = () => {
  const { logout } = useAuth();
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ creating: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountPayload>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountPayload> = (payload) => {
    callApi("creating", () => accountEndpoints.addAccount(payload), {
      onSuccess: (res) => {
        reset();
        notify.success(res?.message || "Account Created!");
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error?.message : "Account Created!";
        notify.error(errorMessage);
      },
    });
  };

  return (
    <div className="p-6 flex flex-col gap-1">
      <span>User Dashboard</span>

      <button
        onClick={logout}
        className="w-fit px-3 py-1 text-white text-sm bg-red-400 hover:bg-red-500 rounded-md transition-colors"
      >
        Logout
      </button>

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

        {/* Submit */}
        <CustomButton
          type="submit"
          name={loading.creating ? "Creating..." : "Create"}
          className="w-fit"
          loading={loading.creating}
        />
      </form>
    </div>
  );
};

export default Dashboard;
