import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RequestFormType } from '../schema';
import { v4 as uuidv4 } from 'uuid';

export type RequestType = RequestFormType & { id: string };

interface UserRequests {
  [id: string]: RequestType;
}

interface RequestsState {
  [email: string]: UserRequests;
}
const getCurrentUser = () => {
  return localStorage.getItem('user');
};

const getInitialState = (): RequestsState => {
  const currentUser = getCurrentUser();
  return currentUser
    ? JSON.parse(localStorage.getItem(currentUser) || '{}')
    : ({} as RequestsState);
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState: getInitialState(),
  selectors: {
    getCurrentUserRequests: (state) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return [];
      return Object.values(state[currentUser] || {}) as RequestType[];
    },
    getRequestBySearch:
      (state) =>
      (searchTerm: string): RequestType | null => {
        const currentUser = getCurrentUser();
        if (!currentUser) return null;
        const userRequests = Object.values(state[currentUser] || {}) as RequestType[];
        return userRequests.find((request) => request.search === searchTerm) || null;
      },
    getRequestById:
      (state) =>
      (requestId: string): RequestType | null => {
        const currentUser = getCurrentUser();
        if (!currentUser) return null;
        return state[currentUser]?.[requestId] || null;
      },
  },

  reducers: {
    addRequest: (state, action: PayloadAction<{ request: RequestFormType }>) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      if (!state[currentUser]) {
        state[currentUser] = {};
      }

      const existingRequest = Object.values(state[currentUser]).find(
        (req: RequestType) => req.search === action.payload.request.search
      );

      if (!existingRequest) {
        const id = uuidv4();
        const requestWithId: RequestType = { ...action.payload.request, id };
        state[currentUser][id] = requestWithId;
        localStorage.setItem(currentUser, JSON.stringify(state));
      }
    },
    editRequest: (state, action: PayloadAction<{ id: string; request: RequestFormType }>) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      if (!state[currentUser]) {
        state[currentUser] = {};
      }
      const existingRequest = Object.values(state[currentUser]).find(
        (req: RequestType) => req.search === action.payload.request.search
      );

      if (existingRequest) throw new Error('Request already exists');
      const requestWithId: RequestType = { ...action.payload.request, id: action.payload.id };
      state[currentUser][action.payload.id] = requestWithId;
      localStorage.setItem(currentUser, JSON.stringify(state));
    },
    removeRequest: (state, action: PayloadAction<{ id: string }>) => {
      const currentUser = getCurrentUser();
      if (!currentUser || !state[currentUser]) return;
      delete state[currentUser][action.payload.id];

      localStorage.setItem(currentUser, JSON.stringify(state));
    },
  },
});

export const { addRequest, editRequest, removeRequest } = requestsSlice.actions;
export const requestsReducer = requestsSlice.reducer;
export const { getCurrentUserRequests, getRequestBySearch, getRequestById } =
  requestsSlice.selectors;
