import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (classroomId) => {
      const token = tokenManager.getAccessToken();
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
      toast.success("Classroom deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete classroom", {
        description: error.message,
      });
    },
  });
};
