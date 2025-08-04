import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { IExpenseRequest, IExpenseResponse } from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IExpenseResponse,
    Error,
    { expenseId: string; payload: IExpenseRequest }
  >({
    mutationFn: async ({ expenseId, payload }) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.updateExpense(token, expenseId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      toast.success("Expense updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update expense", {
        description: error.message,
      });
    },
  });
};
