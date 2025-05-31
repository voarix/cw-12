import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../users/usersSlice.ts";
import { apiUrl } from "../../../globalConstants.ts";
import type { IActivity } from "../../../types";
import {
  addParticipant,
  fetchGroupByActivityId,
} from "../../groups/groupsThunks.ts";
import { selectGroup } from "../../groups/groupsSlice.ts";
import { toast } from "react-toastify";

interface Props {
  activity: IActivity;
}

const ActivityCard: React.FC<Props> = ({ activity }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const group = useAppSelector(selectGroup);
  const isParticipant = Boolean(
    group?.participants.find((p) => p._id === user?._id),
  );

  const onJoin = async () => {
    try {
      if (user) {
        if (group)
          await dispatch(
            addParticipant({ groupId: group._id, userId: user._id }),
          ).unwrap();
        await dispatch(fetchGroupByActivityId(activity._id!)).unwrap();
        navigate("/");
        setOpen(false);
        toast.success("You joined the group.");
      }
    } catch (e) {
      toast.error("Error while joining the group.");
      navigate("/");
      setOpen(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(fetchGroupByActivityId(activity._id));
    }
  }, [open, activity._id, dispatch]);

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
            onClick={() => navigate(`/${activity._id}`)}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {activity.title}
          </Typography>
          <Typography
            variant="body1"
            color="primary"
            onClick={() => navigate(`/author/${activity.user._id}`)}
            sx={{ cursor: "pointer", textDecoration: "underline", mt: 3 }}
          >
            Author: {activity.user.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Published: {activity.isPublished ? "Yes" : "NO"}
          </Typography>
        </CardContent>
      </Card>

      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 4,
              maxWidth: 800,
              width: "100%",
              boxShadow: 6,
              overflowY: "auto",
              maxHeight: "90vh",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              {activity.title}
            </Typography>

            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ mb: 2, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(`/author/${activity.user._id}`)}
            >
              Author: {activity.user.displayName}
            </Typography>

            {activity.image && (
              <img
                src={apiUrl + "/" + activity.image}
                alt={activity.title}
                style={{
                  maxHeight: "400px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              />
            )}

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 3,
                whiteSpace: "pre-wrap",
              }}
            >
              {activity.description}
            </Typography>

            <DialogActions
              sx={{
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Exit
              </Button>
              {user && !isParticipant && (
                <Button variant="contained" onClick={onJoin}>
                  Join
                </Button>
              )}
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ActivityCard;
