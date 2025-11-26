import { api } from "../../../shared/api/axios";
import { AnalyticsResponse } from "../model/types";

export const fetchStats = async (): Promise<AnalyticsResponse> => {
  const response = await api.get<AnalyticsResponse>("/analytics");
  return response.data;
};