import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
   return {
      type: actionTypes.AUTH_START,
   };
};

export const authSuccess = (token, userId) => {
   return {
      type: actionTypes.AUTH_SUCCESS,
      idToken: token,
      userId: userId,
   };
};

export const authFail = (error) => {
   return {
      type: actionTypes.AUTH_FAIL,
      error: error,
   };
};

// logout flow
export const logout = () => {
   return {
      type: actionTypes.AUTH_LOGOUT,
   };
};

export const checkAuthTimeout = (expirationTime) => {
   return (dispatch) => {
      setTimeout(() => {
         dispatch(logout());
      }, expirationTime * 1000); // expirationTime is already in ms from firebase
   };
};

// Auth flow when signing up a new email or logging in
export const auth = (email, password, isSignup) => {
   const API_KEY = "AIzaSyC90UV-t-FI-_uRGAwDt0MR4hS_Yn0b_nY";
   return (dispatch) => {
      dispatch(authStart());
      const authData = {
         email: email,
         password: password,
         returnSecureToken: true,
      };

      // firebase signup url
      let baseURL =
         "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

      // firebase sign in url
      if (!isSignup) {
         baseURL =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
      }
      axios
         .post(`${baseURL}${API_KEY}`, authData)
         .then((response) => {
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
         })
         .catch((err) => {
            dispatch(authFail(err.response.data.error));
         });
   };
};
