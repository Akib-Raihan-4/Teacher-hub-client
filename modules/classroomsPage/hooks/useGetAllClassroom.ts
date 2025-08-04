import { useQuery } from "@tanstack/react-query";

import { IClassroomExtendedResponse } from "@/types/classroom";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";

import { tokenManager } from "@/lib/api/auth/token-manager";

export const useGetAllClassrooms = () => {
  return useQuery<IClassroomExtendedResponse[], Error>({
    queryKey: ["classrooms"],
    queryFn: () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getAllClassrooms(token);
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
