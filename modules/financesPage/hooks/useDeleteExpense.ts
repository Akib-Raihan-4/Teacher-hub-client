import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (expenseId: string) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.deleteExpense(token, expenseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      toast.success("Expense deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete expense", {
        description: error.message,
      });
    },
  });
};
