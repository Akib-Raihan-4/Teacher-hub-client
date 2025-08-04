import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteIncomeSource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (incomeSourceId: string) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.deleteIncomeSource(token, incomeSourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomeSources"],
      });
      toast.success("Income source deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete income source", {
        description: error.message,
      });
    },
  });
};
