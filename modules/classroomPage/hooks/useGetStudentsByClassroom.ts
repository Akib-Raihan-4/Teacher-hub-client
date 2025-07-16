import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { IStudentPaymentDetails } from "@/types/student";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentsByClassroom = (classroomId: string) => {
  const { hasValidToken } = useAuth();
  return useQuery<IStudentPaymentDetails[], Error>({
    queryKey: ["students", classroomId],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getStudentsByClassroom(token, classroomId);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
