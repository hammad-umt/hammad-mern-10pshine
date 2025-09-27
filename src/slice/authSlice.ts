// authSlice.ts
import { decodeToken } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthState {
  token: string | null;
//   user: User | null;
  isLoggedIn: boolean;
}

const getTokenFromLocalStorage = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        return {
          token,
        //   user: {
        //     id: decoded.id || "",
        //     email: decoded.email!,
        //     username: decoded.username,
        //   },
          isLoggedIn: true,
        };
      }
    }
  }
  return { token: null,  isLoggedIn: false };
};

const initialState: AuthState = getTokenFromLocalStorage();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      localStorage.setItem("token", token);

      const decoded = decodeToken(token);
      if (decoded) {
        // state.user = {
        //   id: decoded.id || "",
        //   email: decoded.email!,
        //   username: decoded.username,
        // };
        state.isLoggedIn = true;
      } else {
        // state.user = null;
        state.isLoggedIn = false;
      }
    },
    logOut: (state) => {
      state.token = null;
    //   state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setLogin, logOut } = authSlice.actions;
export default authSlice.reducer;


