import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import B2BTransferCard from "../../../components/B2BTransferCard";
import PageHeader from "../../../components/common/PageHeader";

import Pagination from "../../../components/ui/Pagination";
import CustomButton from "../../../components/ui/CustomButton";

import { transactionEndpoints } from "../../../services/transaction.service";

import useApi from "../../../hooks/useApi";

import type {
  B2BTransfer,
  PaginationData,
  PaginationParams,
} from "../../../types/api.types";

const B2BTransfersPage = () => {
  const { loading, callApi } = useApi({ loadingTransfers: false });

  const navigate = useNavigate();

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [transfers, setTransfers] = useState<B2BTransfer[]>([]);

  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchTransfers = useCallback(() => {
    callApi(
      "loadingTransfers",
      () => transactionEndpoints.getB2BTransactions(params),
      {
        onSuccess: (res) => {
          setTransfers(res.data.data);
          setPagination(res.data.pagination);
        },
      },
    );
  }, [callApi, params]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        heading="Transfers"
        subHeading="Move money between your own accounts while keeping both sides linked."
      >
        <CustomButton
          name="Add transfer"
          icon={Plus}
          className="w-fit"
          onClick={() => navigate("add")}
        />
      </PageHeader>

      {loading.loadingTransfers ? (
        <p className="rounded-2xl border border-light-border-primary bg-light-bg-primary p-8 text-center text-sm text-light-text-tertiary">
          Loading transfers...
        </p>
      ) : transfers.length ? (
        transfers.map((transfer) => (
          <B2BTransferCard
            key={transfer.transferId}
            transfer={transfer}
            onDelete={() =>
              setTransfers((items) =>
                items.filter((item) => item.transferId !== transfer.transferId),
              )
            }
          />
        ))
      ) : (
        <p className="rounded-2xl border border-dashed border-light-border-secondary bg-light-bg-primary px-6 py-12 text-center text-sm text-light-text-secondary">
          No transfers yet. Add a transfer to record money moved between your
          accounts.
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

export default B2BTransfersPage;
