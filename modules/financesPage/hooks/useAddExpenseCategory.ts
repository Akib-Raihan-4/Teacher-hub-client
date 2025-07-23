import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import {
  IExpenseCategoryRequest,
  IExpenseCategoryResponse,
} from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<IExpenseCategoryResponse, Error, IExpenseCategoryRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.addExpenseCategory(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenseCategories"],
      });
      toast.success("Expense category added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add expense category", {
        description: error.message,
      });
    },
  });
};
