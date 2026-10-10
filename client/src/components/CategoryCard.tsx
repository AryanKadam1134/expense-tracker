import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-between gap-4 rounded-md border border-light-border-primary p-3">
      <span className="min-w-0 truncate">{category.name}</span>
      <div className="flex shrink-0 gap-2">
        <CustomButton
          name="Edit"
          onClick={() => navigate(`${category._id}/edit`)}
          disabled={loading.deleting}
        />
        <CustomButton
          name="Delete"
          variant="red"
          onClick={deleteCategory}
          loading={loading.deleting}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
