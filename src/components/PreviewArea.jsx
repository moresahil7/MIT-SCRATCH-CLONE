import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import { useAppContext } from "../context/context";
import {
  ROTATE_SPRITE,
  SET_ACTIVE_SPRITE,
  SET_MULTIPLE_SPRITES,
  UPDATE_MID_AREA_DATA,
  UPDATE_SPRITE_POSITION,
} from "../context/constants";
import { v4 as uuidv4 } from "uuid";
import { MOVE_SPRITE } from "../helpers/sidebarReducer";
import BallSprite from "./BallSprite";

const sprites = {
  cat_sprite: <CatSprite />,
  dog_sprite: <DogSprite />,
  ball_sprite: <BallSprite />,
};

export default function PreviewArea() {
  const { state, dispatch } = useAppContext();
  const [showSprites, setShowSprites] = useState(false);

  const [collision, setCollision] = useState([]);

  const handleSpriteSelect = useCallback(
    (item) => () => {
      dispatch({
        type: SET_ACTIVE_SPRITE,
        payload: item,
      });
    },
    [dispatch]
  );

  const handleMultiSpriteSelect = useCallback(
    (item) => () => {
      dispatch({
        type: SET_MULTIPLE_SPRITES,
        payload: {
          id: uuidv4(),
          name: item,
          x: state.multipleSprites.length * 110,
          y: 0,
          rotate: 0,
        },
      });
      setShowSprites(false);
    },
    [dispatch, state.multipleSprites.length]
  );

  const handlePlayButton = useCallback(() => {
    const spriteInstructions = Object.groupBy(
      state.midAreaData,
      (item) => item?.spriteId
    );

    Object.keys(spriteInstructions).forEach((item) => {
      const instructions = spriteInstructions[item];
      const repeat = instructions?.[0]?.repeat || 1;
      instructions.forEach((item) => {
        if (item?.move) {
          dispatch({
            type: MOVE_SPRITE,
            payload: {
              id: item?.spriteId,
              x: item?.move * repeat,
            },
          });
        }
        if (item?.xc || item?.yc) {
          dispatch({
            type: UPDATE_SPRITE_POSITION,
            payload: {
              id: item?.spriteId,
              x: item?.xc * repeat,
              y: item?.yc * repeat,
            },
          });
        }
        if (item?.turnLeft) {
          dispatch({
            type: ROTATE_SPRITE,
            payload: {
              id: item?.spriteId,
              rotate: item?.turnLeft * repeat,
            },
          });
        }
      });
    });
  }, [dispatch, state.midAreaData]);

  const handleDragDrop = useCallback(
    (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("sprite") ?? "";
      const [, id] = data.split(":");

      const container = e.currentTarget.getBoundingClientRect();

      const x = e.clientX - container.left;
      const y = e.clientY - container.top;
      dispatch({
        type: UPDATE_SPRITE_POSITION,
        payload: {
          id,
          x,
          y,
        },
      });
    },
    [dispatch]
  );

  const checkCollision = useCallback(() => {
    for (let sprite1 of state.multipleSprites) {
      for (let sprite2 of state.multipleSprites) {
        if (sprite1.id !== sprite2.id) {
          let distance = Math.sqrt(
            (sprite1.x - sprite2.x) ** 2 + (sprite1.y - sprite2.y) ** 2
          );
          if (distance < 50) {
            setCollision([sprite1, sprite2]);
          }
        }
      }
    }
  }, [state.multipleSprites]);

  useEffect(() => {
    if (collision.length === 0) {
      checkCollision();
    }
  }, [checkCollision, collision.length]);

  useEffect(() => {
    if (collision.length == 2 && state?.multipleSprites?.length >= 2) {
      dispatch({
        type: "SWAP_POSITIONS_OF_STRIPS",
        payload: {
          id1: state?.multipleSprites?.[0]?.id,
          id2: state?.multipleSprites?.[1]?.id,
        },
      });
      handlePlayButton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collision]);

  const handleShowAllSpritesDlg = () => {
    setShowSprites(true);
  };

  const handleCloseAllSpritesDlg = () => {
    setShowSprites(false);
  };

  return (
    <Stack position={"relative"} height={1} gap={2}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h5">Preview</Typography>
        <Button
          onClick={handleShowAllSpritesDlg}
          size="small"
          variant="secondary"
        >
          ✚ Add Sprite
        </Button>
      </Stack>
      <Stack direction={"row"} ml={"auto"}>
        <Button
          variant="contained"
          startIcon={"▶️"}
          size="small"
          onClick={handlePlayButton}
        >
          Play
        </Button>
      </Stack>
      <Stack
        height={1}
        position={"relative"}
        overflow={"hidden"}
        width={1}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDragDrop}
      >
        {state.multipleSprites.map((item) => {
          return (
            <Box
              key={item.id}
              sx={{
                transition: "all 1s linear",
                position: "absolute",
                left: `${item?.x}px`,
                top: `${item?.y}px`,
                transform: `rotate(${item?.rotate}deg)`,
                cursor: "move",
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("sprite", `id:${item?.id}`);
                // Store the initial mouse offset for more accurate positioning
                const rect = e.currentTarget.getBoundingClientRect();
                e.dataTransfer.setData("offsetX", e.clientX - rect.left);
                e.dataTransfer.setData("offsetY", e.clientY - rect.top);
              }}
            >
              {sprites[item?.name]}
            </Box>
          );
        })}
      </Stack>
      <Stack
        position="absolute"
        display={"flex"}
        alignItems={"center"}
        bottom={0}
        direction={"row"}
        gap={1}
        borderTop={"2px solid #000000"}
        width={1}
        pt={1}
        overflow={"auto"}
      >
        {state.multipleSprites.map((item) => {
          const activeSprite = item.id === state.activeSprite;
          return (
            <Box
              sx={{
                border: activeSprite ? "2px solid #000000" : "",
                p: 2,
              }}
              onClick={handleSpriteSelect(item.id)}
            >
              {sprites[item?.name]}
            </Box>
          );
        })}
      </Stack>
      {showSprites && (
        <Dialog
          open={showSprites}
          onClose={handleCloseAllSpritesDlg}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Sprites</DialogTitle>
          <DialogContent>
            <Stack direction={"row"} justifyContent={"center"} gap={5}>
              {Object.keys(sprites).map((item) => {
                return (
                  <Box onClick={handleMultiSpriteSelect(item)}>
                    {sprites[item]}
                  </Box>
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAllSpritesDlg}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
