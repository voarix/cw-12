import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectActivities,
  selectFetchError,
  selectFetchLoading,
} from "./activitiesSlice.ts";
import { fetchMyActivities } from "./activititesThunks.ts";
import ActivityCard from "./components/ActivityCard.tsx";
import { Container, Grid, Typography } from "@mui/material";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";

const MyActivities: React.FC = () => {
  const dispatch = useAppDispatch();

  const activities = useAppSelector(selectActivities);
  const loading = useAppSelector(selectFetchLoading);
  const error = useAppSelector(selectFetchError);

  useEffect(() => {
    dispatch(fetchMyActivities());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <Typography variant="h6" align="center" sx={{ width: "100%", mt: 5 }}>
        {"errors" in error ? error.message : error.error}
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h2">My Activities:</Typography>
      {activities.length === 0 ? (
        <Typography variant="body1">No activities found</Typography>
      ) : (
        <Grid container spacing={3}>
          {activities.map((activity) => (
            <Grid key={activity._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ActivityCard activity={activity} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyActivities;
