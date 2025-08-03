import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { IClassroomWithSummary } from "@/types/classroom";
import { useQuery } from "@tanstack/react-query";

export const useGetClassroomById = (classroomId: string) => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IClassroomWithSummary, Error>({
    queryKey: ["classroom", classroomId],
    queryFn: () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getClassroomById(token, classroomId);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
