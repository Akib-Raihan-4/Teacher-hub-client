import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUnpaidRecord = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (studentId: string) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return studentAPI.deleteUnpaidRecord(token, studentId);
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
      toast.success("Unpaid record deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete unpaid record", {
        description: error.message,
      });
    },
  });
};
