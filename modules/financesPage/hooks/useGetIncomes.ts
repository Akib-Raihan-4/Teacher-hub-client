import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useAuth } from "@/lib/hooks/useAuth";
import { IIncomeWithSource } from "@/types/finances";
import { PaginatedResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

export const useGetIncomes = (
  paginationParams?: { page?: number; limit?: number },
  searchTerm?: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const { hasValidToken } = useAuth();
  return useQuery<PaginatedResponse<IIncomeWithSource[]>, Error>({
    queryKey: [
      "incomes",
      paginationParams?.page,
      paginationParams?.limit,
      searchTerm,
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return financesAPI.getTeacherIncome(
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
