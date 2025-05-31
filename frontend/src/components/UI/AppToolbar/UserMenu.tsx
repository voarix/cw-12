import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import type { User } from "../../../types";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks.ts";
import { logout } from "../../../features/users/usersThunks.ts";
import {
  unsetAccessToken,
  unsetUser,
} from "../../../features/users/usersSlice.ts";
import { toast } from "react-toastify";
import { fetchAllActivities } from "../../../features/activities/activititesThunks.ts";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();

  const handeClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserOptionsEl(event.currentTarget);
  };

  const handleClose = () => {
    setUserOptionsEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(unsetUser());
      dispatch(unsetAccessToken());
      navigate("/");
      dispatch(fetchAllActivities());
      toast.success("Logout is successful");
    } catch (e) {
      toast.error("Logout is failed");
      console.error(e);
    }
  };

  return (
    <>
      <Link
        to="/my-training-activities"
        style={{
          color: "white",
          textDecoration: "none",
          marginLeft: "6px",
          fontWeight: 500,
        }}
      >
        My Training Activities
      </Link>
      <Link
        to="/my-activities"
        style={{
          color: "white",
          textDecoration: "none",
          marginLeft: "6px",
          fontWeight: 500,
        }}
      >
        My Groups
      </Link>
      <Link
        to="/add-activity"
        style={{
          color: "white",
          textDecoration: "none",
          marginLeft: "6px",
          fontWeight: 500,
        }}
      >
        New Activity
      </Link>
      <Button onClick={handeClick} color="inherit">
        Hello, {user.displayName}
      </Button>
      <Menu
        keepMounted
        anchorEl={userOptionsEl}
        open={!!userOptionsEl}
        onClose={handleClose}
      >
        <MenuItem>
          <Button onClick={handleLogout}>Log Out</Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
