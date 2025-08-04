import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useAuth } from "@/lib/hooks/useAuth";
import { IExpenseCategoryResponse } from "@/types/finances";
import { useQuery } from "@tanstack/react-query";

export const useGetExpenseCategories = () => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IExpenseCategoryResponse[], Error>({
    queryKey: ["expenseCategories"],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.getTeacherExpenseCategories(token);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
