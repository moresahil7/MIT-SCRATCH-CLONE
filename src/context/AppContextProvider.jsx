import React, { useMemo, useReducer } from "react";
import { AppContext } from "./context";
import { v4 as uuidv4 } from "uuid";

import {
  SET_MID_AREA_DATA,
  SET_ACTIVE_SPRITE,
  SET_MULTIPLE_SPRITES,
  UPDATE_SPRITE_POSITION,
  ROTATE_SPRITE,
  MOVE_SPRITE,
  SWAP_POSITIONS_OF_STRIPS,
  DELETE_MID_AREA_DATA,
  SET_REPEAT_IN_MID_AREA,
  UPDATE_MID_AREA_DATA,
} from "./constants";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_MID_AREA_DATA:
      return {
        ...state,
        midAreaData: [
          ...(state.midAreaData ?? []),
          { spriteId: state.activeSprite, ...action.payload },
        ],
      };
    case UPDATE_MID_AREA_DATA:
      return {
        ...state,
        midAreaData: state.midAreaData?.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                ...action.payload,
              }
            : item
        ),
      };
    case SET_REPEAT_IN_MID_AREA:
      return {
        ...state,
        midAreaData: [
          { spriteId: state.activeSprite, ...action.payload },
          ...(state.midAreaData ?? []),
        ],
      };
    case DELETE_MID_AREA_DATA:
      return {
        ...state,
        midAreaData: state.midAreaData?.filter(
          (item) => item?.id !== action.payload?.id
        ),
      };
    case SET_ACTIVE_SPRITE:
      return { ...state, activeSprite: action.payload };

    case SET_MULTIPLE_SPRITES:
      return {
        ...state,
        multipleSprites: [...(state?.multipleSprites ?? []), action.payload],
      };
    case SWAP_POSITIONS_OF_STRIPS: {
      const { id1, id2 } = action.payload;
      const sprite1 = state.multipleSprites.find((sprite) => sprite.id === id1);
      const sprite2 = state.multipleSprites.find((sprite) => sprite.id === id2);
      if (!sprite1 || !sprite2) return state;
      return {
        ...state,
        multipleSprites: state.multipleSprites.map((sprite) => {
          if (sprite.id === id2) {
            return {
              ...sprite,
              name: sprite1.name,
              id: id1,
            };
          } else if (sprite.id === id1) {
            return {
              ...sprite,
              name: sprite2.name,
              id: id2,
            };
          }
          return sprite;
        }),
      };
    }
    case MOVE_SPRITE:
      return {
        ...state,
        multipleSprites: state.multipleSprites.map((sprite) =>
          sprite.id === action.payload.id
            ? {
                ...sprite,
                x: action.payload.x + sprite.x,
              }
            : sprite
        ),
      };
    case UPDATE_SPRITE_POSITION:
      return {
        ...state,
        multipleSprites: state.multipleSprites.map((sprite) =>
          sprite.id === action.payload.id
            ? {
                ...sprite,
                x: action.payload.x ?? sprite.x,
                y: action.payload.y ?? sprite.y,
              }
            : sprite
        ),
      };
    case ROTATE_SPRITE:
      return {
        ...state,
        multipleSprites: state.multipleSprites.map((sprite) =>
          sprite.id === action.payload.id
            ? {
                ...sprite,
                rotate: action.payload.rotate + (sprite.rotate ?? 0),
              }
            : sprite
        ),
      };
    default:
      return state;
  }
};

export const AppContextProvider = ({ children }) => {
  const id = uuidv4();
  const initialState = useMemo(
    () => ({
      midAreaData: [],
      activeSprite: id,
      collision: [],
      multipleSprites: [
        {
          id,
          name: "cat_sprite",
          x: 0,
          y: 0,
          rotate: 0,
        },
      ],
    }),
    [id]
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
