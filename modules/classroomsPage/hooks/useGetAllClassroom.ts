import { useQuery } from "@tanstack/react-query";

import { IClassroomExtendedResponse } from "@/types/classroom";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { tokenManager } from "@/lib/api/auth/token-manager";

export const useGetAllClassrooms = () => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IClassroomExtendedResponse[], Error>({
    queryKey: ["classrooms"],
    queryFn: () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getAllClassrooms(token);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
