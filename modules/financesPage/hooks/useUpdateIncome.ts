import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { IIncomeRequest, IIncomeResponse } from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IIncomeResponse,
    Error,
    { incomeId: string; payload: IIncomeRequest }
  >({
    mutationFn: async ({ incomeId, payload }) => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.updateIncome(token, incomeId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomes"],
      });
      toast.success("Income updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update income", {
        description: error.message,
      });
    },
  });
};
