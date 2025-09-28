import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from './authBaseQuery';
import type { AuthSchemaType, LoginSchemaType } from '../model/schema';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: createAuthBaseQuery({
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
