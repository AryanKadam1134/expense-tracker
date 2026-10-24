import { useNavigate } from "react-router-dom";
import { Tags } from "lucide-react";

import CustomButton from "./ui/CustomButton";

import { categoryEndpoints } from "../services/category.service";

import useApi from "../hooks/useApi";

import { useNotify } from "../context/notification";

import type { Category } from "../types/api.types";

type CategoryCardProps = {
  category: Category;
  onDelete: () => void;
};

const CategoryCard = ({ category, onDelete }: CategoryCardProps) => {
  const { notify } = useNotify();

  const { loading, callApi } = useApi({ deleting: false });

  const navigate = useNavigate();

  const deleteCategory = () => {
    callApi("deleting", () => categoryEndpoints.deleteCategory(category._id), {
      onSuccess: (response) => {
        onDelete();
        notify.success(response.message || "Category deleted!");
      },
      onError: (error) => {
        notify.error(
          error instanceof Error ? error.message : "Couldn't delete category!",
        );
      },
    });
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f1effb] text-[#6452a1]">
          <Tags size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-light-text-tertiary">
            Category
          </p>
          <h2 className="mt-1 truncate text-base font-semibold text-light-text-primary">
            {category.name}
          </h2>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t border-light-border-primary pt-4 sm:border-0 sm:pt-0">
        <CustomButton
          name="Edit"
          size="small"
          variant="green"
          onClick={() => navigate(`${category._id}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          size="small"
          variant="red"
          onClick={deleteCategory}
          loading={loading.deleting}
        />
      </div>
    </article>
  );
};

export default CategoryCard;
