import { useCallback, useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";

import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { categoryEndpoints } from "../../../services/category.service";

import useApi from "../../../hooks/useApi";

import { useNotify } from "../../../context/notification";

import type { CategoryPayload } from "../../../types/api.types";

const CategoryFormPage = () => {
  const { notify } = useNotify();

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(categoryId);

  const { loading, callApi } = useApi({
    categoryLoading: false,
    saving: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CategoryPayload>({ mode: "onChange" });

  const fetchCategory = useCallback(() => {
    if (!categoryId) return;

    callApi(
      "categoryLoading",
      () => categoryEndpoints.getCategory(categoryId),
      {
        onSuccess: (res) => reset({ name: res.data.name }),
      },
    );
  }, [callApi, categoryId, reset]);

  const onSubmit: SubmitHandler<CategoryPayload> = (payload) => {
    const body = isEditing
      ? getUpdatedFields(payload, dirtyFields)
      : { name: payload.name.trim() };

    if (isEditing && Object.keys(body).length === 0) {
      notify.info("No changes to save.");
      return;
    }

    if ("name" in body && body.name !== undefined) {
      body.name = body.name.trim();
    }

    callApi(
      "saving",
      () =>
        isEditing && categoryId
          ? categoryEndpoints.updateCategory(categoryId, body)
          : categoryEndpoints.addCategory({ name: payload.name.trim() }),
      {
        onSuccess: (response) => {
          notify.success(
            response.message ||
              (isEditing ? "Category updated!" : "Category created!"),
          );

          navigate("/categories");
        },
        onError: (error) => {
          notify.error(
            error instanceof Error
              ? error.message
              : isEditing
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
      className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-5 rounded-3xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_10px_38px_rgba(23,43,36,0.05)] sm:p-8"
    >
      <div className="mb-1 border-b border-light-border-primary pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b8f76]">
          Transaction labels
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-light-text-primary">
          {isEditing ? "Edit category" : "Add a category"}
        </h1>
        <p className="mt-1 text-sm text-light-text-secondary">
          Use a clear name to make transactions easier to understand.
        </p>
      </div>
      {/* Category name */}
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
