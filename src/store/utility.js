export const updateObject = (oldObject, updatedProperities) => {
   return {
      ...oldObject,
      ...updatedProperities,
   };
};
