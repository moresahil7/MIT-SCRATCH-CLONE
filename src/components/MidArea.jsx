import { Box, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useAppContext } from "../context/context";
import {
  SET_MID_AREA_DATA,
  DELETE_MID_AREA_DATA,
  SET_REPEAT_IN_MID_AREA,
  UPDATE_MID_AREA_DATA,
} from "../context/constants";
import "./styles.css";
import { SmallInputBox } from "./SmallInputBox";

import { v4 as uuid } from "uuid";

export default function MidArea() {
  const { state, dispatch } = useAppContext();

  const handleDragDrop = useCallback(
    (e) => {
      e.preventDefault();
      const list = e.dataTransfer.getData("text/plain");
      if (list?.includes("coordinates")) {
        const [, xc, yc] = list.split(":");
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: {
            xc: Number(xc),
            yc: Number(yc),
            id: uuid(),
          },
        });
        return;
      }

      const [key, val] = list.split(":");
      if (list?.includes("repeat")) {
        dispatch({
          type: SET_REPEAT_IN_MID_AREA,
          payload: {
            [key]: Number(val),
            id: uuid(),
          },
        });
        return;
      }
      dispatch({
        type: SET_MID_AREA_DATA,
        payload: {
          [key]: Number(val),
          id: uuid(),
        },
      });
    },
    [dispatch]
  );

  const handleDeleteData = useCallback(
    (id) => () => {
      dispatch({
        type: DELETE_MID_AREA_DATA,
        payload: { id: id },
      });
    },
    [dispatch]
  );

  const handleChangeData = useCallback(
    (id) => (e) => {
      dispatch({
        type: UPDATE_MID_AREA_DATA,
        payload: {
          id,
          [e.target.name]: e.target.value,
        },
      });
    },
    [dispatch]
  );
  return (
    <Stack
      height={"100%"}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleDragDrop}
    >
      <Typography variant="h5">Mid Area</Typography>
      <Stack gap={2}>
        {state.midAreaData
          .filter((item) => item?.spriteId === state.activeSprite)
          .map((item) => {
            if (Object.prototype.hasOwnProperty.call(item, "move")) {
              return (
                <Box className="sidebarEvents">
                  Move{" "}
                  <SmallInputBox
                    value={item?.move}
                    name="move"
                    onChange={handleChangeData(item?.id)}
                    type="number"
                  />{" "}
                  steps
                  <span className="deleteBTN">
                    <button onClick={handleDeleteData(item?.id)}>❌ </button>
                  </span>
                </Box>
              );
            }
            if (Object.prototype.hasOwnProperty.call(item, "turnLeft")) {
              return (
                <Box className="sidebarEvents">
                  Turn{" "}
                  <SmallInputBox
                    name="turnLeft"
                    value={item?.turnLeft ?? 0}
                    onChange={handleChangeData(item?.id)}
                  />
                  degrees
                  <span className="deleteBTN">
                    <button onClick={handleDeleteData(item?.id)}>❌ </button>
                  </span>
                </Box>
              );
            }
            if (
              Object.prototype.hasOwnProperty.call(item, "xc") ||
              Object.prototype.hasOwnProperty.call(item, "yc")
            ) {
              return (
                <Box className="sidebarEvents">
                  Goto x:{" "}
                  <SmallInputBox
                    value={item?.xc ?? 0}
                    name="xc"
                    type="number"
                    onChange={handleChangeData(item?.id)}
                  />{" "}
                  and y:{" "}
                  <SmallInputBox
                    value={item?.yc ?? 0}
                    name="yc"
                    type="number"
                    onChange={handleChangeData(item?.id)}
                  />
                  <span className="deleteBTN">
                    <button onClick={handleDeleteData(item?.id)}>❌ </button>
                  </span>
                </Box>
              );
            }
            if (Object.prototype.hasOwnProperty.call(item, "repeat")) {
              return (
                <Box className="sidebarEvents">
                  Repeat{" "}
                  <SmallInputBox
                    value={item?.repeat ?? 0}
                    name="repeat"
                    onChange={handleChangeData(item?.id)}
                  />
                  <span className="deleteBTN">
                    <button onClick={handleDeleteData(item?.id)}>❌ </button>
                  </span>
                </Box>
              );
            }
            return null;
          })}
      </Stack>
    </Stack>
  );
}
