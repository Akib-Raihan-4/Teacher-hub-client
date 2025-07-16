import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { IStudentPaymentDetails, IStudentRequest } from "@/types/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateStudent = (classroomId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IStudentPaymentDetails,
    Error,
    { studentId: string; payload: IStudentRequest }
  >({
    mutationFn: async ({ studentId, payload }) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return studentAPI.updateStudent(token, studentId, payload);
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
      toast.success("Student updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update student", {
        description: error.message,
      });
    },
  });
};
