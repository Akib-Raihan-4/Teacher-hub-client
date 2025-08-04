import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (expenseCategoryId: string) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.deleteExpenseCategory(token, expenseCategoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories"],
      });
      toast.success("Expense category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete expense category", {
        description: error.message,
      });
    },
  });
};
