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
   localStorage.removeItem("token");
   localStorage.removeItem("expirationDate");
   localStorage.removeItem("userId");
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
   const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
   return (dispatch) => {
      dispatch(authStart());
      const authData = {
         email: email,
         password: password,
         returnSecureToken: true,
      };

      // firebase signup url
      let baseURL = process.env.REACT_APP_SIGNUP_URL;

      // firebase sign in url
      if (!isSignup) {
         baseURL = process.env.REACT_APP_SIGNIN_URL;
      }
      axios
         .post(`${baseURL}${API_KEY}`, authData)
         .then((response) => {
            // calculate the current date when user logs in
            const expirationDate = new Date(
               new Date().getTime() + response.data.expiresIn * 1000
            );

            // Save the date calculated above to local storage
            localStorage.setItem("token", response.data.idToken);
            localStorage.setItem("expirationDate", expirationDate);
            localStorage.setItem("userId", response.data.localId);

            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
         })
         .catch((err) => {
            dispatch(authFail(err.response.data.error));
         });
   };
};

// Redirect path for user redirection when building
// a burger without signing in
export const setAuthRedirectPath = (path) => {
   return {
      type: actionTypes.SET_AUTH_REDIRECT_PATH,
      path: path,
   };
};

// Log user in automatically if the user previously logged in
// Look into local storage to see if user already logged in
export const authCheckState = () => {
   return (dispatch) => {
      const token = localStorage.getItem("token");
      if (!token) {
         dispatch(logout());
      } else {
         const expirationDate = new Date(
            localStorage.getItem("expirationDate")
         );
         if (expirationDate <= new Date()) {
            dispatch(logout());
         } else {
            const userId = localStorage.getItem("userId");
            dispatch(authSuccess(token, userId));
            dispatch(
               checkAuthTimeout(
                  (expirationDate.getTime() - new Date().getTime()) / 1000
               )
            );
         }
      }
   };
};
