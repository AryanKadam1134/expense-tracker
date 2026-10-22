import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import B2BTransferCard from "../../../components/B2BTransferCard";

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
    <div className="flex flex-col gap-4">
      <CustomButton
        name="Add transfer"
        icon={Plus}
        className="self-end w-fit"
        onClick={() => navigate("add")}
      />

      {loading.loadingTransfers ? (
        <p>Loading transfers...</p>
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
        <p>No bank to bank transfers yet.</p>
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
