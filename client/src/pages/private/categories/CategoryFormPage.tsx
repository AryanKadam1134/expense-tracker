import { useCallback, useEffect } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../../components/common/PageHeader";

import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import CustomButton from "../../../components/ui/CustomButton";

import { getUpdatedFields } from "../../../utils/getUpdatedFields";

import { categoryEndpoints } from "../../../services/category.service";

import useApi from "../../../hooks/useApi";
import useFieldErrors from "../../../hooks/useFieldErrors";

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
    setError,
    formState: { errors, dirtyFields },
  } = useForm<CategoryPayload>({ mode: "onChange" });
  const { addErrors } = useFieldErrors(setError);

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
          addErrors(error);
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
    <div className="flex flex-col gap-6">
      <PageHeader
        heading={isEditing ? "Edit category" : "Add a category"}
        subHeading="Use a clear name to make transactions easier to understand."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 gap-5 rounded-3xl border border-light-border-primary bg-light-bg-primary p-5 shadow-[0_10px_38px_rgba(23,43,36,0.05)] sm:p-8"
      >
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
    </div>
  );
};

export default CategoryFormPage;
