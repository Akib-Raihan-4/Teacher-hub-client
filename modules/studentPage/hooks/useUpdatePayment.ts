import { tokenManager } from "@/lib/api/auth/token-manager";
import { paymentAPI } from "@/lib/api/payments/payments";
import { IPaymentRequest, IPaymentResponse } from "@/types/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdatePayment = (studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IPaymentResponse,
    Error,
    { paymentId: string; payload: IPaymentRequest }
  >({
    mutationFn: async ({ paymentId, payload }) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return paymentAPI.updatePayment(token, paymentId, payload);
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
      toast.success("Payment updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update payment", {
        description: error.message,
      });
    },
  });
};
