import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Tags } from "lucide-react";

import CategoryCard from "../../../components/CategoryCard";
import PageHeader from "../../../components/common/PageHeader";

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
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Categories"
        subHeading="Give transactions useful labels so your activity is easier to understand."
      >
        <CustomButton
          name="Add Category"
          icon={Tags}
          onClick={() => navigate("add")}
          className="w-fit"
        />
      </PageHeader>

      {loading.categoriesLoading ? (
        <p className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading categories...
        </p>
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
        <p className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No categories yet. Add a category to make your transaction list easier
          to scan.
        </p>
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
