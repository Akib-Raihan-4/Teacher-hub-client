import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveStudent = (classroomId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (studentId: string) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return studentAPI.removeStudent(token, studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", classroomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["classroom", classroomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["classrooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["classrooms-summary"],
      });
      toast.success("Student removed successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to remove student", {
        description: error.message,
      });
    },
  });
};
