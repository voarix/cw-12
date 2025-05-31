import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCreateError, selectCreateLoading } from "./activitiesSlice";
import FileInput from "../../components/UI/FileInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createActivity } from "./activititesThunks.ts";

interface ActivityFormInputs {
  title: string;
  description: string;
  image: File | null;
}

const NewActivity = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectCreateLoading);
  const error = useAppSelector(selectCreateError);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const onSubmit = async (data: ActivityFormInputs) => {
    try {
      await dispatch(createActivity(data)).unwrap();
      toast.success("Activity created successfully!");
      navigate("/");
    } catch (e) {
      toast.error("Failed to create activity");
      console.error(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Activity
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register("description", {
              required: "Description is required",
            })}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="image"
            control={control}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <FileInput
                name="image"
                label="Image"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  field.onChange(file);
                }}
                errors={!!errors.image}
                helperText={errors.image?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained" fullWidth>
              Create Activity
            </Button>
          )}
        </Grid>

        {error && (
          <Grid size={{ xs: 12 }}>
            <Typography color="error">{JSON.stringify(error)}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NewActivity;
