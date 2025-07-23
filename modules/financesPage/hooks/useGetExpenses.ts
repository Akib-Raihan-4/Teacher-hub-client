import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useAuth } from "@/lib/hooks/useAuth";
import { IExpenseWithCategory } from "@/types/finances";
import { PaginatedResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

export const useGetExpenses = (
  paginationParams?: { page?: number; limit?: number },
  searchTerm?: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const { hasValidToken } = useAuth();
  return useQuery<PaginatedResponse<IExpenseWithCategory[]>, Error>({
    queryKey: [
      "expenses",
      paginationParams?.page,
      paginationParams?.limit,
      searchTerm,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.getTeacherExpense(
        token,
        paginationParams,
        searchTerm,
        dateFrom,
        dateTo
      );
    },
    enabled: hasValidToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
