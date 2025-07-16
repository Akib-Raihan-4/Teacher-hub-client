import { tokenManager } from "@/lib/api/auth/token-manager";
import { paymentAPI } from "@/lib/api/payments/payments";

import { IPaymentRequest, IPaymentResponse } from "@/types/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePayment = (studentId: string, classroomId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IPaymentResponse, Error, IPaymentRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return paymentAPI.createPayment(token, {
        ...payload,
        studentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", classroomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["classroom", classroomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["classrooms-summary"],
      });
      toast.success("Payment created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create payment", {
        description: error.message,
      });
    },
  });
};
