import { tokenManager } from "@/lib/api/auth/token-manager";
import { paymentAPI } from "@/lib/api/payments/payments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePayment = (paymentId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (paymentId: string) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return paymentAPI.deletePayment(token, paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", studentId],
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
      toast.success("Payment deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete payment", {
        description: error.message,
      });
    },
  });
};
