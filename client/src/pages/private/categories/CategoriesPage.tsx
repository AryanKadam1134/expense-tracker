import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Tags } from "lucide-react";

import CategoryCard from "../../../components/CategoryCard";

import CustomButton from "../../../components/ui/CustomButton";

import { categoryEndpoints } from "../../../services/category.service";

import useApi from "../../../hooks/useApi";

import type { Category } from "../../../types/api.types";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const { loading, callApi } = useApi({ categoriesLoading: false });

  const navigate = useNavigate();

  const fetchCategories = useCallback(() => {
    callApi("categoriesLoading", categoryEndpoints.getCategories, {
      onSuccess: (response) => setCategories(response.data),
    });
  }, [callApi]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add Category"
        icon={Tags}
        onClick={() => navigate("add")}
        className="self-end w-fit"
      />

      {loading.categoriesLoading ? (
        <p>Loading categories...</p>
      ) : categories.length ? (
        categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onDelete={() =>
              setCategories((current) =>
                current.filter((item) => item._id !== category._id),
              )
            }
          />
        ))
      ) : (
        <p>No categories yet.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
