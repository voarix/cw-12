import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectGroup, selectGroupsLoading } from "../groups/groupsSlice.ts";
import { selectUser } from "../users/usersSlice.ts";
import {
  addParticipant,
  fetchGroupByActivityId,
  removeParticipant,
} from "../groups/groupsThunks.ts";
import { apiUrl } from "../../globalConstants.ts";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";
import { toast } from "react-toastify";

const ActivityDetails: React.FC = () => {
  const { id: activityId } = useParams();
  const dispatch = useAppDispatch();
  const group = useAppSelector(selectGroup);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectGroupsLoading);

  useEffect(() => {
    if (activityId) {
      dispatch(fetchGroupByActivityId(activityId));
    }
  }, [dispatch, activityId]);

  if (loading) return <Spinner />;
  if (!group) return <Typography>For this group not found activity</Typography>;

  const isParticipant = Boolean(
    group.participants.find((p) => p._id === user?._id),
  );
  const owner = user?._id === group.user._id;

  const onLeave = async () => {
    try {
      if (user)
        await dispatch(
          removeParticipant({ groupId: group._id, userId: user._id }),
        ).unwrap();
      if (activityId)
        await dispatch(fetchGroupByActivityId(activityId)).unwrap();
      toast.success("You have leaved");
    } catch (e) {
      toast.error("Error while leaving the group.");
      console.error(e);
    }
  };

  const onJoin = async () => {
    try {
      if (user) {
        await dispatch(
          addParticipant({ groupId: group._id, userId: user._id }),
        ).unwrap();
        await dispatch(fetchGroupByActivityId(activityId!)).unwrap();
        toast.success("You joined the group.");
      }
    } catch (e) {
      toast.error("Error while joining the group.");
      console.error(e);
    }
  };

  const onRemoveParticipant = async (participantId: string) => {
    try {
      await dispatch(
        removeParticipant({ groupId: group._id, userId: participantId }),
      ).unwrap();
      if (activityId)
        await dispatch(fetchGroupByActivityId(activityId)).unwrap();
      toast.success("Participant has been deleted successfully.");
    } catch (e) {
      toast.error("Error while removing participant.");
      console.error(e);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {group.activity.title}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Author: {group.user.displayName}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Participants in group: {group.numberParticipants}
      </Typography>

      {group.activity.image && (
        <img
          src={apiUrl + "/" + group.activity.image}
          alt={group.activity.title}
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 20,
            objectFit: "cover",
            maxHeight: "400px",
          }}
        />
      )}

      <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
        {group.activity.description}
      </Typography>

      {user ? (
        isParticipant ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Participants:
            </Typography>
            <Box
              sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 3 }}
            >
              {group.participants.map((part) => (
                <Box
                  key={part._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar>{part.displayName[0]}</Avatar>
                    <Typography>{part.displayName}</Typography>
                  </Box>
                  {owner && part._id !== user._id && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onRemoveParticipant(part._id)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            </Box>

            <Button variant="outlined" color="error" onClick={onLeave}>
              LEave group
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={onJoin}>
            Join to group
          </Button>
        )
      ) : null}
    </Box>
  );
};

export default ActivityDetails;
