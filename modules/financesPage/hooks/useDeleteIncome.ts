import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (incomeId: string) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.deleteIncome(token, incomeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomes"],
      });
      toast.success("Income deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete income", {
        description: error.message,
      });
    },
  });
};
