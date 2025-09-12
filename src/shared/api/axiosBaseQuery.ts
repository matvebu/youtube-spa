import type { BaseQueryFn, QueryReturnValue } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

type ServerErrorData = { success: boolean; message: string } | { message: string };

export type RtkAxiosError = {
  status: number;
  data: { success: boolean; message: string };
};

import { z } from 'zod';

export const RtkAxiosErrorSchema = z.object({
  status: z.number(),
  data: z.object({
    success: z.boolean().optional(),
    message: z.string(),
  }),
});

export const SerializedErrorSchema = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
  stack: z.string().optional(),
  code: z.string().optional(),
});

export function getErrorMessage(err: unknown): string {
  const axiosErr = RtkAxiosErrorSchema.safeParse(err);
  if (axiosErr.success) return axiosErr.data.data.message;

  const ser = SerializedErrorSchema.safeParse(err);
  if (ser.success && ser.data.message) return ser.data.message;

  return 'Something went wrong';
}

export const axiosBaseQuery =
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
    RtkAxiosError
  > =>
  async ({
    url,
    method,
    data,
    params,
    headers,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  }): Promise<QueryReturnValue<unknown, RtkAxiosError, {}>> => {
    try {
      const res = await axios({ url: baseUrl + url, method, data, params, headers });
      return { data: res.data };
    } catch (e) {
      const err = e as AxiosError<ServerErrorData>;
      const raw = err.response?.data;

      const message =
        typeof raw === 'string' ? raw : (raw?.message ?? err.message ?? 'Unknown error');

      return {
        error: {
          status: err.response?.status ?? 0,
          data: { success: false, message },
        },
      };
    }
  };
