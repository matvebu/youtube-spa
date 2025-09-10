import type { BaseQueryFn, QueryReturnValue } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

export type AxiosBaseQueryError = {
  data: { success: boolean; message: string } | { message: string };
};

type ServerErrorData = { success: boolean; message: string } | { message: string };

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
    AxiosBaseQueryError,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {}
  > =>
  async ({
    url,
    method,
    data,
    params,
    headers,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  }): Promise<QueryReturnValue<unknown, AxiosBaseQueryError, {}>> => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (e) {
      const err = e as AxiosError<ServerErrorData>;
      const raw = err.response?.data;

      // ← делаем message всегда string
      const message =
        typeof raw === 'string'
          ? raw
          : (raw as { message?: unknown })?.message &&
              typeof (raw as ServerErrorData).message === 'string'
            ? (raw as ServerErrorData).message
            : (err.message ?? 'Unknown error');

      return {
        error: {
          data: { success: false, message }, // ВАЖНО: success = false
        },
      };
    }
  };
