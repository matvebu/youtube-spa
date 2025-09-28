import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

export type AuthApiError = {
  error: {
    message: string;
    statusCode?: number;
    [key: string]: unknown;
  };
};

export const createAuthBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    AuthApiError
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          error: {
            message: (err.response?.data as { message?: string })?.message || err.message,
            statusCode: err.response?.status,
          },
        },
      };
    }
  };

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as AuthApiError;
    return apiError.error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
