import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../users/usersSlice.ts";
import { apiUrl } from "../../../globalConstants.ts";
import type { IActivity } from "../../../types";

interface Props {
  activity: IActivity;
}

const ActivityCard: React.FC<Props> = ({ activity }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const goToAuthor = () => {
    if (activity.user?._id) {
      navigate(`/author/${activity.user._id}`);
    }
  };

  const onDetail = () => {
    navigate(`/${activity._id}`);
  };

  const onJoin = () => {
    navigate(`/groups/${activity._id}`);
    setOpen(false);
  };

  return (
    <>
      <Card>
        {activity.image && (
          <CardMedia
            component="img"
            height="140"
            image={apiUrl + "/" + activity.image}
            alt={activity.title}
            onClick={() => setOpen(true)}
            sx={{ objectFit: "cover", cursor: "pointer" }}
          />
        )}
        <CardContent>
          <Typography
            variant="h6"
            onClick={onDetail}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {activity.title}
          </Typography>
          <Typography
            variant="body1"
            color="primary"
            onClick={goToAuthor}
            sx={{ cursor: "pointer", textDecoration: "underline", mt: 3 }}
          >
            Author: {activity.user.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
            Published: {activity.isPublished ? "Yes" : "NO"}
          </Typography>
        </CardContent>
      </Card>

      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            height: "100%",
            background: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            flexDirection: 'column',
          }}
        >
          {activity.image && (
            <img
              src={apiUrl + "/" + activity.image}
              alt={activity.title}
              style={{ maxHeight: "90%", maxWidth: "100%", objectFit: "contain" }}
            />
          )}
          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Exit
            </Button>
            {user && (
              <Button variant="contained" onClick={onJoin}>
                Join
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default ActivityCard;
