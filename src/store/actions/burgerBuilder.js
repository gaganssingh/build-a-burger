import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredient = (name) => {
   return {
      type: actionTypes.ADD_INGREDIENT,
      ingredientName: name,
   };
};

export const removeIngredient = (name) => {
   return {
      type: actionTypes.REMOVE_INGREDIENT,
      ingredientName: name,
   };
};

// Synchronous action creator for the
// Async redux thunk enabled action acretor below (initIngredients)
export const setIngredients = (ingredients) => {
   return {
      type: actionTypes.SET_INGREDIENTS,
      ingredients: ingredients,
   };
};

// Synchronous action creator for the
// Async redux thunk enabled action acretor below (initIngredients)
export const fetchIngredientsFail = () => {
   return {
      type: actionTypes.FETCH_INGREDIENTS_FAILED,
   };
};

export const initIngredients = () => {
   return (dispatch) => {
      axios
         .get(process.env.REACT_APP_BACKEND_INGREDIENTS_URL)
         .then((response) => {
            dispatch(setIngredients(response.data));
         })
         .catch((error) => {
            dispatch(fetchIngredientsFail());
         });
   };
};
