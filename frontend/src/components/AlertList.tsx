import { useQuery } from "@tanstack/react-query";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Alert as MuiAlert,
} from "@mui/material";
import { format } from "date-fns";
import { api } from "../services/api";
import type { Alert } from "../types";

export const AlertList = () => {
  const {
    data: alerts,
    isLoading,
    error,
  } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: api.alerts.getInactive,
  });

  if (isLoading) {
    return <Typography>Loading alerts...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading alerts</Typography>;
  }

  if (!alerts?.length) {
    return <MuiAlert severity="success">No inactive profiles found</MuiAlert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Inactive Profiles
      </Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.handle}>
            <ListItemText
              primary={alert.handle}
              secondary={
                alert.lastActivity
                  ? `Last activity: ${format(
                      new Date(alert.lastActivity),
                      "PPpp"
                    )}`
                  : "No activity recorded"
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
