import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { useAuth } from "@/lib/hooks/useAuth";
import { IClassroomExtendedResponse } from "@/types/classroom";
import { useQuery } from "@tanstack/react-query";

export const useGetClassroomById = (classroomId: string) => {
  const { hasValidToken } = useAuth();
  return useQuery<IClassroomExtendedResponse, Error>({
    queryKey: ["classroom", classroomId],
    queryFn: () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getClassroomById(token, classroomId);
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
