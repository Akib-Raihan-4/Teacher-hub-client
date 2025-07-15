import { tokenManager } from "@/lib/api/auth/token-manager";
import { studentAPI } from "@/lib/api/students/students";
import { IStudentPaymentDetails, IStudentRequest } from "@/types/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddStudent = (classroomId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IStudentPaymentDetails, Error, IStudentRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return studentAPI.addStudent(token, {
        ...payload,
        classroomId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      toast.success("Student added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add student", {
        description: error.message,
      });
    },
  });
};
