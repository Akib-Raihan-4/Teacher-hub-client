import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { IAllClassroomsSummary } from "@/types/classroom";
import { useQuery } from "@tanstack/react-query";

export const useGetAllClassroomsSummary = () => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IAllClassroomsSummary, Error>({
    queryKey: ["classrooms-summary"],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getAllClassroomsSummary(token);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
