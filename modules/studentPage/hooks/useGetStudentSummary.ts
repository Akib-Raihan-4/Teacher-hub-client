import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { useAuth } from "@/lib/hooks/useAuth";
import { IStudentSummary } from "@/types/student";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentSummary = (studentId: string) => {
  const { hasValidToken } = useAuth();
  return useQuery<IStudentSummary, Error>({
    queryKey: ["student", studentId],
    queryFn: () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return studentAPI.getStudentSummary(token, studentId);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
