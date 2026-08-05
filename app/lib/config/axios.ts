import axios from "axios";
import axiosRetry from "axios-retry";
import { ENV_CONFIG } from "~/lib/utils/constants";

const axiosInstance = axios.create({
  // When the real API is ready, set this to the actual backend URL
  baseURL: ENV_CONFIG.apiBaseUrl ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

export default axiosInstance;
