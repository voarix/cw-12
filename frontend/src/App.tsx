import "./App.css";
import { Container, CssBaseline, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import { Route, Routes } from "react-router-dom";
import Login from "./features/users/Login.tsx";
import Register from "./features/users/Register.tsx";
import Activities from "./features/activities/Activities.tsx";
import AuthorActivities from "./features/activities/AuthorActivities.tsx";
import ActivityDetails from "./features/activities/ActivityDetails.tsx";
import MyActivities from "./features/activities/MyActivities.tsx";
import NewActivity from "./features/activities/NewActivity.tsx";
import ProtectedRoute from "./components/UI/ProtectedRoute.tsx";
import { useAppSelector } from "./app/hooks.ts";
import { selectUser } from "./features/users/usersSlice.ts";
import MyTrainingActivities from "./features/activities/MyTrainingActivities.tsx";
import AdminLayout from "./features/admin/AdminLayout.tsx";
import AdminActivities from "./features/admin/activities/AdminActivities.tsx";

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <CssBaseline />
      <ToastContainer autoClose={1000} />
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Activities />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/author/:authorId" element={<AuthorActivities />} />
            <Route path="/:id" element={<ActivityDetails />} />

            <Route
              path="/my-activities"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <MyActivities />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-activity"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <NewActivity />
                </ProtectedRoute>
              }
            />

            <Route
              path="my-training-activities"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <MyTrainingActivities />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin"
              element={
                <ProtectedRoute isAllowed={user && user.role === "admin"}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={""} />
              <Route path="activities" element={<AdminActivities />} />
            </Route>

            <Route
              path="*"
              element={<Typography variant="h4">Not found page</Typography>}
            />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;
