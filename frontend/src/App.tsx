import "./App.css";
import { Container, CssBaseline, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import { Route, Routes } from "react-router-dom";
import Login from "./features/users/Login.tsx";
import Register from "./features/users/Register.tsx";
import Activities from "./features/activities/Activities.tsx";

const App = () => {
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
