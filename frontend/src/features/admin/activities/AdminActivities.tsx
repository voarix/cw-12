import { useEffect } from "react";
import {
  deleteAdminActivity,
  fetchAdminActivities,
  togglePublishedAdminActivity,
} from "./activitiesAdminThunks";

import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { toast } from "react-toastify";
import Spinner from "../../../components/UI/Spinner/Spinner.tsx";
import {
  selectAdminActivities,
  selectAdminError,
  selectAdminLoading,
} from "./activitiesAdminSlice.ts";

const AdminActivities = () => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectAdminActivities);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);

  useEffect(() => {
    dispatch(fetchAdminActivities());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        dispatch(deleteAdminActivity(id)).unwrap();
        toast.success("Delete activities!");
      } catch (e) {
        toast.error("You can't delete this activities");
        console.error(e);
      }
    }
  };

  const handleTogglePublished = (id: string) => {
    try {
      dispatch(togglePublishedAdminActivity(id)).unwrap();
      toast.success("Published admin activities!");
    } catch (e) {
      toast.error("Failed to change this activities!");
      console.error(e);
    }
  };

  if (loading) return <Spinner />;
  if (error) {
    return (
      <Typography variant="h6" align="center" sx={{ width: "100%", mt: 5 }}>
        {"errors" in error ? error.message : error.error}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <List>
        {activities.map((activity) => (
          <ListItem
            key={activity._id}
            secondaryAction={
              <>
                <IconButton
                  sx={{ border: "1px solid" }}
                  aria-label="toggle-published"
                  onClick={() => handleTogglePublished(activity._id)}
                  title={activity.isPublished ? "Unpublish" : "Publish"}
                >
                  {activity.isPublished ? (
                    <ToggleOnIcon color="success" />
                  ) : (
                    <ToggleOffIcon color="disabled" />
                  )}
                </IconButton>

                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(activity._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={activity.title}
              secondary={<>{activity.user.email}</>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminActivities;
