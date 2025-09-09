import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../shared/api/axiosBaseQuery';
import type { AuthSchemaType } from '../schema/schema';

export const authApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://todo-redev.herokuapp.com',
  }),
  endpoints(build) {
    return {
      // query: build.query({ query: () => ({ url: '/query', method: 'get' }) }),
      register: build.mutation({
        query: (body: AuthSchemaType) => ({
          url: '/api/users/register',
          method: 'post',
          data: body,
        }),
      }),
    };
  },
});

export const { useRegisterMutation } = authApi;
