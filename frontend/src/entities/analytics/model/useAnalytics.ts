import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "../api/analyticsApi";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: fetchStats,
    refetchInterval: 10000, // Poll every 10 seconds (Optional, since we have WebSockets)
  });
};