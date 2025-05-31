import React, { useEffect } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import {
  selectGroupsLoading,
  selectParticipatedGroups,
} from "../groups/groupsSlice.ts";
import { fetchMyParticipatedGroups } from "../groups/groupsThunks.ts";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";

const MyTrainingActivities: React.FC = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectParticipatedGroups);
  const loading = useAppSelector(selectGroupsLoading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyParticipatedGroups());
  }, [dispatch]);

  if (loading) return <Spinner />;

  if (groups.length === 0) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
        You are not participating in any training activities yet.
      </Typography>
    );
  }

  return (
    <Box sx={{mb: 5}}>
      <Typography variant="h3" sx={{ mt: 3, mb: 4 }}>
        My training activities
      </Typography>
      <hr />

      {groups.map((group) => (
        <Card
          key={group._id}
          sx={{ cursor: "pointer", mt: 4 }}
          onClick={() => navigate(`/${group.activity._id}`)}
        >
          <CardContent>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {group.activity.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Participants: {group.participants.length}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              fullWidth
              onClick={() => {
                navigate(`/groups/${group._id}`);
              }}
            >
              Open Activity
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyTrainingActivities;
