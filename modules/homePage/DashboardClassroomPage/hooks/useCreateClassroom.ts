import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { IClassroomRequest, IClassroomResponse } from "@/types/classroom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<IClassroomResponse, Error, IClassroomRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getToken();

      if (!token) throw new Error("No token");

      return classroomAPI.createClassroom(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};
