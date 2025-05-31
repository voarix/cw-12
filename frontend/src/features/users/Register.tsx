import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectRegisterError, selectRegisterLoading } from "./usersSlice.ts";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Button, Grid, TextField } from "@mui/material";
import { register } from "./usersThunks.ts";
import { toast } from "react-toastify";
import type { RegisterMutation } from "../../types";

const initialForm: RegisterMutation = {
  email: "",
  password: "",
  confirmPassword: "",
  displayName: "",
};

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterMutation>(initialForm);

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      toast.success("Registration is successful");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={onSubmitFormHandler}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="family-name"
              value={form.email}
              onChange={onInputChange}
              helperText={getFieldError("email")}
              error={Boolean(getFieldError("email"))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={onInputChange}
              helperText={getFieldError("password")}
              error={Boolean(getFieldError("password"))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              name="confirmPassword"
              label="Confirm password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={onInputChange}
              helperText={getFieldError("confirmPassword")}
              error={Boolean(getFieldError("confirmPassword"))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              name="displayName"
              label="Display Name"
              type="text"
              id="displayName"
              autoComplete="nickname"
              value={form.displayName}
              onChange={onInputChange}
              helperText={getFieldError("displayName")}
              error={Boolean(getFieldError("displayName"))}
            />
          </Grid>
        </Grid>
        <Button
          disabled={registerLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="space-between">
          <Grid sx={{ mx: "auto" }}>
            <Link to="/login" variant="body2" component={RouterLink}>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
