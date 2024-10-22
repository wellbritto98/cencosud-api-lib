import { combineReducers } from 'redux';

const exampleReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ACTION_TYPE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  example: exampleReducer,
});
