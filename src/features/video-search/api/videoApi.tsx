import { createApi } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter, type EntityState } from '@reduxjs/toolkit';
import { createVideoBaseQuery } from './videoBaseQuery';
import type { SearchVideoResponse, ViewsCountResponse, Video } from '../model/types';
import type { SearchRequestType } from '../model/schema';

const searchAdapter = createEntityAdapter({
  selectId: (entity: Video) => entity.id.videoId,
});

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: createVideoBaseQuery({
    baseUrl: 'https://www.googleapis.com/youtube/v3/',
  }),
  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const args = queryArgs as SearchRequestType;
    return `${endpointName}-${args.search}-${args.maxResults}-${args.order}`;
  },
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

export const { useSearchQuery, useLazyGetViewsCountQuery } = videoApi;
