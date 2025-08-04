import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { IUnpaidRecord, IUnpaidRecordResponse } from "@/types/unpaidRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUnpaidRecord = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IUnpaidRecordResponse,
    Error,
    { studentId: string; payload: IUnpaidRecord }
  >({
    mutationFn: async ({ studentId, payload }) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return studentAPI.updateUnpaidRecord(token, studentId, payload);
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
      toast.success("Unpaid record updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update unpaid record", {
        description: error.message,
      });
    },
  });
};
