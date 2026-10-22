import type { Model, PipelineStage, SortOrder } from "mongoose";
import type { Filter } from "mongodb";

type QueryPaginationOptions<T> = {
  model: Model<T>;
  page?: number;
  limit?: number;
  filter?: Filter<T>;
  sort?: Record<string, SortOrder>;
  populate?: string;
};

type AggregatePaginationOptions<T> = {
  model: Model<T>;
  pipeline?: PipelineStage[];
  page?: number;
  limit?: number;
};

const paginateQuery = async <T>({
  model,
  page = 1,
  limit = 10,
  filter = {},
  sort = { createdAt: -1 },
  populate = "",
}: QueryPaginationOptions<T>) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;
  const safePage = parsedPage < 1 ? 1 : parsedPage;
  const safeLimit = parsedLimit < 1 ? 10 : parsedLimit;
  const skip = (safePage - 1) * safeLimit;

  const [data, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(safeLimit)
      .populate(populate),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total: Number(total),
      page: Number(safePage),
      limit: Number(safeLimit),
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    },
  };
};

const paginateAggregate = async <T>({
  model,
  pipeline = [],
  page = 1,
  limit = 10,
}: AggregatePaginationOptions<T>) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;

  const safePage = parsedPage < 1 ? 1 : parsedPage;
  const safeLimit = parsedLimit < 1 ? 10 : parsedLimit;

  const skip = (safePage - 1) * safeLimit;

  const [facetResult] = await model.aggregate([
    ...pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: safeLimit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = facetResult?.total?.[0]?.count || 0;

  return {
    data: facetResult?.data || [],
    pagination: {
      total: Number(total),
      page: Number(safePage),
      limit: Number(safeLimit),
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    },
  };
};

export { paginateQuery, paginateAggregate };
