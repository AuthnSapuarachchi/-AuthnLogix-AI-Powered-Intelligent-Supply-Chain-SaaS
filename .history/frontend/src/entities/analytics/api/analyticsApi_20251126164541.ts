import { api } from "../../../shared/api/axios";
import type { AnalyticsResponse } from "../";

export const fetchStats = async (): Promise<AnalyticsResponse> => {
  const response = await api.get<AnalyticsResponse>("/analytics");
  return response.data;
};