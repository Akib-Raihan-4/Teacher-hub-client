import { useQuery } from "@tanstack/react-query";

import { IClassroomExtendedResponse, } from "@/types/classroom";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { tokenManager } from "@/lib/auth/token-manager";

export const useGetAllClassrooms = () => {
  const { hasValidToken } = useAuth();
  return useQuery<IClassroomExtendedResponse[], Error>({
    queryKey: ["classrooms"],
    queryFn: () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getAllClassrooms(token);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
};
