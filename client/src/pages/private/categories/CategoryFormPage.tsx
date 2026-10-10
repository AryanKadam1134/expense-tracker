import { useCallback, useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";

import useApi from "../../../hooks/useApi";

import { categoryEndpoints } from "../../../services/category.service";

import { useNotify } from "../../../context/notification";

import type { CategoryPayload } from "../../../types/api.types";

const CategoryFormPage = () => {
  const { notify } = useNotify();

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { loading, callApi } = useApi({
    categoryLoading: false,
    saving: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryPayload>({ mode: "onChange" });

  const fetchCategory = useCallback(() => {
    if (!categoryId) return;

    callApi(
      "categoryLoading",
      () => categoryEndpoints.getCategory(categoryId),
      {
        onSuccess: (response) => reset({ name: response.data.name }),
        onError: (error) => {
          notify.error(
            error instanceof Error ? error.message : "Couldn't load category!",
          );
        },
      },
    );
  }, [callApi, categoryId, notify, reset]);

  const onSubmit: SubmitHandler<CategoryPayload> = (payload) => {
    const body = { name: payload.name.trim() };

    callApi(
      "saving",
      () =>
        categoryId
          ? categoryEndpoints.updateCategory(body, categoryId)
          : categoryEndpoints.addCategory(body),
      {
        onSuccess: (response) => {
          notify.success(
            response.message ||
              (categoryId ? "Category updated!" : "Category created!"),
          );
          navigate("/categories");
        },
        onError: (error) => {
          notify.error(
            error instanceof Error
              ? error.message
              : categoryId
                ? "Couldn't update category!"
                : "Couldn't create category!",
          );
        },
      },
    );
  };

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid max-w-xl grid-cols-1 gap-6"
    >
      <FormField
        id="name"
        label="Category name"
        required
        error={errors.name?.message}
      >
        <CustomInput
          id="name"
          type="text"
          placeholder="e.g. Groceries"
          {...register("name", {
            required: "Category name is required!",
            validate: (value) =>
              value.trim().length > 0 || "Category name is required!",
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

export default CategoryFormPage;
