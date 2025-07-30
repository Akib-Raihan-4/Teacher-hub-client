import { tokenManager } from "@/lib/api/auth/token-manager";
import { classroomAPI } from "@/lib/api/classrooms/classrooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IClassroomExtendedResponse,
  IClassroomRequest,
} from "@/types/classroom";
import { toast } from "sonner";

export const useUpdateClassroom = (classroomId: string) => {
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
      queryClient.invalidateQueries({
        queryKey: ["classroom", classroomId],
      })
      toast.success("Classroom updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update classroom", {
        description: error.message,
      });
    },
  });
};
