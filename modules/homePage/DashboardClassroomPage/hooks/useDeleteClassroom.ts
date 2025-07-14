import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (classroomId) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");

      return classroomAPI.deleteClassroom(token, classroomId);
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
