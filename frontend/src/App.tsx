import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
} from "@mui/material";
import { ProfileList } from "./components/ProfileList";
import { AlertList } from "./components/AlertList";
import { ActivityForm } from "./components/ActivityForm";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <CssBaseline />
        <AppBar position="static" sx={{ width: "100vw", top: 0, left: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Twitter Monitoring
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Profiles
            </Button>
            <Button color="inherit" component={Link} to="/alerts">
              Alerts
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <ActivityForm />
                  <ProfileList />
                </Box>
              }
            />
            <Route
              path="/alerts"
              element={
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <ActivityForm />
                  <AlertList />
                </Box>
              }
            />
          </Routes>
        </Container>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
