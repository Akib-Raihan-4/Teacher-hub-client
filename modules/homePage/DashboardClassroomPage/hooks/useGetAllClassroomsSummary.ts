import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { IAllClassroomsSummary } from "@/types/classroom";
import { useQuery } from "@tanstack/react-query";

export const useGetAllClassroomsSummary = () => {
  const { hasValidToken } = useAuth();
  return useQuery<IAllClassroomsSummary, Error>({
    queryKey: ["classrooms-summary"],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getAllClassroomsSummary(token);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
