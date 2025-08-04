import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { 
    IIncomeSourceRequest, 
    IIncomeSourceResponse 
} from "@/types/finances";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddIncomeSource = () => {
  const queryClient = useQueryClient();
  return useMutation<IIncomeSourceResponse, Error, IIncomeSourceRequest>({
    mutationFn: async (payload) => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.addIncomeSource(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incomeSources"],
      });
      toast.success("Income source added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add income source", {
        description: error.message,
      });
    },
  });
};
