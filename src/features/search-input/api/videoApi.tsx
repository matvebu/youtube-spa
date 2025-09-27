import { createApi } from '@reduxjs/toolkit/query/react';
import type { SearchVideoResponse, Video, ViewsCountResponse } from '../types';
import type { SearchRequestType } from '../schema/schema';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit';

export type SearchServerError = {
  error: {
    message: string;
    [key: string]: unknown;
  };
};

const axiosBaseQuery =
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
    SearchServerError
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
            message:
              (err.response?.data as { error?: { message?: string } })?.error?.message ||
              err.message,
          },
        },
      };
    }
  };

const searchAdapter = createEntityAdapter({
  selectId: (entity: Video) => entity.id.videoId,
});

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://www.googleapis.com/youtube/v3/',
  }),
  endpoints(build) {
    return {
      search: build.query<
        { videos: EntityState<Video, string>; totalResults: number },
        SearchRequestType
      >({
        query: ({ search, maxResults = 12, order = 'relevance' }) => ({
          url: `search?maxResults=${maxResults}&order=${order}&part=snippet&videoEmbeddable=true&q=${search}&type=video&key=${import.meta.env.VITE_API_KEY}`,
        }),
        transformResponse(response: SearchVideoResponse) {
          return {
            videos: searchAdapter.setAll(searchAdapter.getInitialState(), response.items),
            totalResults: response.pageInfo.totalResults,
          };
        },
      }),
      getViewsCount: build.query<ViewsCountResponse, string[]>({
        query: (videoIds) => ({
          url: `videos?part=statistics&id=${videoIds.join()}&key=${import.meta.env.VITE_API_KEY}`,
        }),
      }),
      getVideo: build.query<ViewsCountResponse, string[]>({
        query: (videoId) => ({
          url: `videos?part=snippet&id=${videoId}&key=${import.meta.env.VITE_API_KEY}`,
        }),
      }),
    };
  },
});

export const { useLazySearchQuery, useLazyGetViewsCountQuery } = videoApi;
