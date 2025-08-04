import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { useAuth } from "@/lib/hooks/useAuth";
import { IIncomeSourceResponse } from "@/types/finances";
import { useQuery } from "@tanstack/react-query";

export const useGetIncomeSources = () => {
  const { hasValidAccessToken } = useAuth();
  return useQuery<IIncomeSourceResponse[], Error>({
    queryKey: ["incomeSources"],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.getTeacherIncomeSources(token);
    },
    enabled: hasValidAccessToken(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
