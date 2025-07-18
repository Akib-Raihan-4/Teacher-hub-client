import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { useAuth } from "@/lib/hooks/useAuth";
import { IUnpaidRecordResponse } from "@/types/unpaidRecord";
import { useQuery } from "@tanstack/react-query";

export const useGetUnpaidRecord = (studentId: string) => {
  const { hasValidToken } = useAuth();
  return useQuery<IUnpaidRecordResponse, Error>({
    queryKey: ["unpaid-record", studentId],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return studentAPI.getUnpaidRecord(token, studentId);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
