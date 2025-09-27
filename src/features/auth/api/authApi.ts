import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosAuthBaseQuery';
import type { AuthSchemaType, LoginSchemaType } from '../schema/schema';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://todo-redev.herokuapp.com',
  }),
  endpoints(build) {
    return {
      register: build.mutation<AuthSchemaType, AuthSchemaType>({
        query: (body: AuthSchemaType) => ({
          url: '/api/users/register',
          method: 'post',
          data: body,
        }),
      }),
      login: build.mutation<{ token: string }, LoginSchemaType>({
        query: (body: LoginSchemaType) => ({
          url: '/api/auth/login',
          method: 'post',
          data: body,
        }),
      }),
    };
  },
});

export const { useRegisterMutation, useLoginMutation } = authApi;
