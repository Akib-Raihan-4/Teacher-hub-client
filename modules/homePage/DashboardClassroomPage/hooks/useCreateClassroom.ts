import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import {
  IClassroomExtendedResponse,
  IClassroomRequest,
} from "@/types/classroom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<IClassroomExtendedResponse, Error, IClassroomRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getToken();

      if (!token) throw new Error("No token");

      return classroomAPI.createClassroom(token, payload);
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
