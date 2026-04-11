import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let user = null;

try {
  if (userStr) {
    user = JSON.parse(userStr);
  }
} catch (e) {
  console.error("Failed to parse user from local storage");
}

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
