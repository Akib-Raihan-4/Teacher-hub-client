import { tokenManager } from "@/lib/api/auth/token-manager";
import { unpaidRecordAPI } from "@/lib/api/unpaidRecords/unpaidRecords";
import { IUnpaidRecord, IUnpaidRecordResponse } from "@/types/unpaidRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddUnpaidRecord = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IUnpaidRecordResponse, Error, IUnpaidRecord>({
    mutationFn: async (payload) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return await unpaidRecordAPI.addUnpaidRecord(token, {
        ...payload,
        studentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unpaid-record", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["student", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["classroom"],
      });
      toast.success("Unpaid record added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add unpaid record", {
        description: error.message,
      });
    },
  });
};
