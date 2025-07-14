import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IClassroomExtendedResponse,
  IClassroomRequest,
} from "@/types/classroom";

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IClassroomExtendedResponse,
    Error,
    { classroomId: string; payload: IClassroomRequest }
  >({
    mutationFn: async ({ classroomId, payload }) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");

      return classroomAPI.updateClassroom(token, classroomId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classrooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["classrooms-summary"],
      });
    },
  });
};
