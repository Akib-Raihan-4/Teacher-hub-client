import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { useAuth } from "@/lib/hooks/useAuth";
import { IPaymentResponse } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";

export const useGetPayments = (studentId: string) => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IPaymentResponse[], Error>({
    queryKey: ["payments", studentId],
    queryFn: () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return studentAPI.getPayments(token, studentId);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
