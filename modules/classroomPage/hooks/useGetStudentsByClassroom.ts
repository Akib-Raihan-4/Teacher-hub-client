import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { PaginatedResponse } from "@/types/pagination";
import { IStudentPaymentDetails } from "@/types/student";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentsByClassroom = (
  classroomId: string,
  paginationParams?: { page?: number; limit?: number },
  search?: string
) => {
  return useQuery<PaginatedResponse<IStudentPaymentDetails[]>, Error>({
    queryKey: [
      "students",
      classroomId,
      paginationParams?.page,
      paginationParams?.limit,
      search,
    ],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return classroomAPI.getStudentsByClassroom(
        token,
        classroomId,
        paginationParams,
        search
      );
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
