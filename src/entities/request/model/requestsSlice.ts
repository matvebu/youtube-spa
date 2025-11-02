import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RequestFormType } from './schema';
import { v4 as uuidv4 } from 'uuid';

export type RequestType = RequestFormType & { id: string };

export interface UserRequests {
  [id: string]: RequestType;
}

export interface RequestsState {
  [email: string]: UserRequests | null;
}

export interface AddRequestPayload {
  request: RequestFormType;
  currentUser: string;
}

export interface EditRequestPayload {
  request: RequestType;
  currentUser: string;
}

export interface RemoveRequestPayload {
  id: string;
  currentUser: string;
}

const getInitialState = (): RequestsState => {
  return {} as RequestsState;
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState: getInitialState(),
  selectors: {
    getRequestBySearch:
      (requests) =>
      (currentUser: string, searchTerm: string): RequestType | null => {
        if (!currentUser || !requests[currentUser]) return null;
        const userRequests = Object.values(requests[currentUser]) as RequestType[];
        return userRequests.find((request) => request.search === searchTerm) || null;
      },

    getRequestById:
      (requests) =>
      (currentUser: string, requestId: string): RequestType | null => {
        if (!currentUser) return null;
        return requests[currentUser]?.[requestId] || null;
      },
  },

  reducers: {
    addRequest: (state, action: PayloadAction<AddRequestPayload>) => {
      const { currentUser, request } = action.payload;
      if (!currentUser) return;
      if (!state[currentUser]) {
        state[currentUser] = {};
      }

      const existingRequest = Object.values(state[currentUser]).find(
        (req: RequestType) => req.search === request.search
      );

      if (!existingRequest) {
        const id = uuidv4();
        const requestWithId: RequestType = { ...request, id };
        state[currentUser][id] = requestWithId;
      }
    },
    editRequest: (state, action: PayloadAction<EditRequestPayload>) => {
      const { currentUser, request } = action.payload;
      if (currentUser && request?.id && state[currentUser]) {
        state[currentUser][request.id] = request;
      }
    },
    removeRequest: (state, action: PayloadAction<RemoveRequestPayload>) => {
      const { currentUser, id } = action.payload;
      delete state[currentUser]?.[id];
    },
  },
});

export const { addRequest, editRequest, removeRequest } = requestsSlice.actions;
export const requestsReducer = requestsSlice.reducer;
export const { getRequestBySearch, getRequestById } = requestsSlice.selectors;

export const getCurrentUserRequests = createSelector(
  [
    (state: { requests: RequestsState }) => state.requests,
    (_state: { requests: RequestsState }, currentUser: string) => currentUser,
  ],
  (requests, currentUser) => {
    if (!currentUser) return [];
    const userRequests = requests[currentUser];
    if (!userRequests) return [];
    return Object.values(userRequests) as RequestType[];
  }
);
