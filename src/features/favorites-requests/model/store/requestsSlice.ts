import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RequestFormType } from '../schema';
import { v4 as uuidv4 } from 'uuid';

export type RequestType = RequestFormType & { id: string };

interface UserRequests {
  [id: string]: RequestType;
}

export interface RequestsState {
  [email: string]: UserRequests | null;
}

const getInitialState = (): RequestsState => {
  return {} as RequestsState;
};

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

const requestsSlice = createSlice({
  name: 'requests',
  initialState: getInitialState(),
  selectors: {
    getCurrentUserRequests:
      (requests) =>
      (currentUser: string): RequestType[] => {
        if (!currentUser) return [];
        return Object.values(requests[currentUser] || {}) as RequestType[];
      },

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
export const { getCurrentUserRequests, getRequestBySearch, getRequestById } =
  requestsSlice.selectors;
