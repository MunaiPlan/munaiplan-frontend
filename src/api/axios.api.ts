import axios from 'axios';
import { store } from '../store/store';
import { login, logout } from '../store/user/userSlice';
import { createLocalStore } from '../helpers/createLocalStore';
import { isUnauthorizedCurrentSession, isUsableSession } from '../auth/session';
import type { IUser } from '../types/types';

const instance = axios.create({});
const localUserStore = createLocalStore<IUser>('munaiplan.session.v1');
let expiryTimer: number | undefined;

const scheduleExpiry = (user: IUser) => {
  if (expiryTimer !== undefined) {
    window.clearTimeout(expiryTimer);
  }
  const remainingMs = Math.max(0, user.tokenExpiresAt * 1000 - Date.now());
  expiryTimer = window.setTimeout(() => {
    if (isUsableSession(user)) {
      scheduleExpiry(user);
    } else {
      removeUserLocally();
    }
  }, Math.min(remainingMs, 2_147_483_647));
};

const init = () => {
  const restored = localUserStore.get();
  if (isUsableSession(restored)) {
    store.dispatch(login(restored));
    scheduleExpiry(restored);
  } else {
    localUserStore.remove();
    store.dispatch(logout());
  }
};

const saveUserLocally = (user: IUser) => {
  if (!isUsableSession(user)) {
    throw new Error('Cannot save an expired session');
  }
  localUserStore.set(user);
  scheduleExpiry(user);
};

const removeUserLocally = () => {
  if (expiryTimer !== undefined) {
    window.clearTimeout(expiryTimer);
    expiryTimer = undefined;
  }
  localUserStore.remove();
  store.dispatch(logout());
};

instance.interceptors.request.use((config) => {
  if (config.url?.endsWith('/users/sign-in')) {
    return config;
  }
  const user = store.getState().user.user;
  if (user) {
    if (!isUsableSession(user)) {
      removeUserLocally();
      return Promise.reject(new Error('Session expired'));
    }
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

instance.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 &&
      !error.config?.url?.endsWith('/users/sign-in')) {
    const requestAuthorization = error.config?.headers?.get('Authorization');
    const currentToken = store.getState().user.user?.token;
    if (isUnauthorizedCurrentSession(requestAuthorization, currentToken)) {
      removeUserLocally();
    }
  }
  return Promise.reject(error);
});

export { init, instance, saveUserLocally, removeUserLocally };
