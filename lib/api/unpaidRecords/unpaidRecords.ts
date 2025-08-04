import { IUnpaidRecord, IUnpaidRecordResponse } from "@/types/unpaidRecord";
import { API_BASE_URL } from "../auth/auth";
import { fetchWithAuth } from "@/lib/hooks/fetchWithAuth";

export const unpaidRecordAPI = {
  addUnpaidRecord: async (
    token: string,
    payload: IUnpaidRecord
  ): Promise<IUnpaidRecordResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/unpaid-record`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add unpaid record");
    }
    return data.data;
  },
};
