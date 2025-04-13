// Action Types
export const SET_TURN = "SET_LEFT_TURN";
export const SET_RIGHT_TURN = "SET_RIGHT_TURN";
export const SET_X_COORDINATE = "SET_X_COORDINATE";
export const SET_Y_COORDINATE = "SET_Y_COORDINATE";
export const MOVE_SPRITE = "MOVE_SPRITE";
export const REPEAT_ANIMATION = "REPEAT_ANIMATION";

// Initial State
export const initialState = {
  leftTurn: 15,
  rightTurn: 15,
  xCoordinate: 0,
  yCoordinate: 0,
  moveSprite: 0,
  repeat: 0,
};

// Reducer
export const sidebarReducer = (state, action) => {
  switch (action.type) {
    case SET_TURN:
      return { ...state, leftTurn: action.payload };
    case SET_X_COORDINATE:
      return { ...state, xCoordinate: action.payload };
    case SET_Y_COORDINATE:
      return { ...state, yCoordinate: action.payload };
    case MOVE_SPRITE:
      return { ...state, moveSprite: action.payload };
    case REPEAT_ANIMATION:
      return { ...state, repeat: action.payload };
    default:
      return state;
  }
};
