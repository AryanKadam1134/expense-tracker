import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import B2BTransferCard from "../../../components/B2BTransferCard";
import CustomButton from "../../../components/ui/CustomButton";
import useApi from "../../../hooks/useApi";
import { transactionEndpoints } from "../../../services/transaction.service";
import type { B2BTransfer } from "../../../types/api.types";

const B2BTransfersPage = () => {
  const [transfers, setTransfers] = useState<B2BTransfer[]>([]);
  const { loading, callApi } = useApi({ loadingTransfers: false });
  const navigate = useNavigate();

  const fetchTransfers = useCallback(() => {
    callApi("loadingTransfers", transactionEndpoints.getB2BTransactions, {
      onSuccess: (res) => setTransfers(res.data),
    });
  }, [callApi]);

  useEffect(() => fetchTransfers(), [fetchTransfers]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Bank to bank transfers</h1>
        <CustomButton
          name="Add transfer"
          icon={Plus}
          className="w-fit"
          onClick={() => navigate("add")}
        />
      </div>
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
    </section>
  );
};

export default B2BTransfersPage;
