import axios from "axios";
import { store } from "../store/store"; // Import your Redux store
import { login, logout } from "../store/user/userSlice"; // Assuming you have a logout action
import { isTokenExpired } from "../helpers/tokenExpirationChecker";
import { createLocalStore } from "../helpers/createLocalStore";
import type { IUser } from "../types/types"; 

// Axios instance configuration
const instance = axios.create({});

const userLocalKey = "asldkasjd"; // random string
const localUserStore = createLocalStore<IUser>(userLocalKey);

const init = () => {
  const userFromLocalStore = localUserStore.get();
  if (!userFromLocalStore) return;
  if (isTokenExpired(userFromLocalStore.tokenExpiresAt)) {
    localUserStore.remove();
    return;
  };

  store.dispatch(login(userFromLocalStore));
}

const saveUserLocally = (user: IUser) => {
  localUserStore.set(user);
}

const removeUserLocally = () => {
  localUserStore.remove();
}

// Function to retrieve the user from the Redux store
const getUserFromStore = (): IUser | null => {
    const state = store.getState(); // Access the current state
    return state.user.user; // Assuming your userSlice is named 'user' and stores the user info in 'user'
}

// Check authentication status
const checkAuth = (dispatch: any, user: IUser) => {
    const { tokenExpiresAt } = user;

    if (isTokenExpired(tokenExpiresAt)) {
        dispatch(logout());
    }
}

// Add a request interceptor to check authentication before making requests
instance.interceptors.request.use(
    async (config) => {
        const user: IUser | null = getUserFromStore(); // Retrieve the user from the Redux store
        // If the user is logged in, check the authentication status
        if (user) {
            checkAuth(store.dispatch, user); // Pass the store's dispatch function to checkAuth
            config.headers.Authorization = 'Bearer ' + user.token; // Attach the current token to the request headers
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export {
  init,
  instance,
  saveUserLocally,
  removeUserLocally,
};
