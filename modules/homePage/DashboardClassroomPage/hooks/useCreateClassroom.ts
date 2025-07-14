import { tokenManager } from "@/lib/auth/token-manager";
import { classroomAPI } from "@/lib/classrooms/classrooms";
import {
  IClassroomExtendedResponse,
  IClassroomRequest,
} from "@/types/classroom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Classroom created successfully");
    },

    onError: (error: Error) => {
      toast.error("Failed to create classroom", {
        description: error.message,
      });
    },
  });
};
