import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectActivities, selectFetchError, selectFetchLoading } from "./activitiesSlice.ts";
import { fetchAllActivities } from "./activititesThunks.ts";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";
import { Container, Grid, Typography } from "@mui/material";
import ActivityCard from "./components/ActivityCard.tsx";

const Activities: React.FC = () => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectActivities);
  const loading = useAppSelector(selectFetchLoading);
  const error = useAppSelector(selectFetchError);

  useEffect(() => {
    dispatch(fetchAllActivities());
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
    <Container sx={{ mt: 4}}>
      {activities.length === 0 ? (
        <Typography>No activities found.</Typography>
      ) : (
        <Grid container spacing={3} sx={{mt: 4}}>
          {activities.map((activity) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={activity._id}>
              <ActivityCard activity={activity} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Activities;
