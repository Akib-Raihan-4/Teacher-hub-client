import { tokenManager } from "@/lib/api/auth/token-manager";
import { financesAPI } from "@/lib/api/finances/finances";
import { IIncomeSourceResponse } from "@/types/finances";
import { useQuery } from "@tanstack/react-query";

export const useGetIncomeSources = () => {
  return useQuery<IIncomeSourceResponse[], Error>({
    queryKey: ["incomeSources"],
    queryFn: async () => {
      const token = tokenManager.getAccessToken();
      if (!token) throw new Error("No token");
      return financesAPI.getTeacherIncomeSources(token);
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
