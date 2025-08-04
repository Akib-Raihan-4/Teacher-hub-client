import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { IExpenseRequest, IExpenseResponse } from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<IExpenseResponse, Error, IExpenseRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.addExpense(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      toast.success("Expense added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add expense", {
        description: error.message,
      });
    },
  });
};
