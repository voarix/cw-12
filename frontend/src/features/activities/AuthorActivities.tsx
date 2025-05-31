import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, CircularProgress, Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectActivities, selectFetchLoading } from "./activitiesSlice.ts";
import { fetchActivitiesByAuthor } from "./activititesThunks.ts";
import ActivityCard from "./components/ActivityCard.tsx";

const AuthorActivities: React.FC = () => {
  const { authorId } = useParams();
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectActivities);
  const loading = useAppSelector(selectFetchLoading);

  useEffect(() => {
    if (authorId) {
      dispatch(fetchActivitiesByAuthor(authorId));
    }
  }, [dispatch, authorId]);

  const authorName = activities[0].user.displayName;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Activities by: {authorName}
      </Typography>

      {loading ? (
        <CircularProgress />
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

export default AuthorActivities;
