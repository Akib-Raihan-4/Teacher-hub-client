import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { IIncomeRequest, IIncomeResponse } from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<IIncomeResponse, Error, IIncomeRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.addIncome(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomes"],
      });
      toast.success("Income added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add income", {
        description: error.message,
      });
    },
  });
};
