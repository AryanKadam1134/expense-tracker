import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Tags } from "lucide-react";

import CategoryCard from "../../../components/CategoryCard";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { categoryEndpoints } from "../../../services/category.service";

import useApi from "../../../hooks/useApi";

import type {
  Category,
  PaginationData,
  PaginationParams,
} from "../../../types/api.types";

const CategoriesPage = () => {
  const { loading, callApi } = useApi({ categoriesLoading: false });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchCategories = useCallback(() => {
    callApi(
      "categoriesLoading",
      () => categoryEndpoints.getCategories(params),
      {
        onSuccess: (res) => {
          setCategories(res.data.data);
          setPagination(res.data.pagination);
        },
      },
    );
  }, [callApi, params]);

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

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default CategoriesPage;
