import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { api } from "../services/api";
import type { ActivityType, CreateActivityDto } from "../types";

export const ActivityForm = () => {
  const [handle, setHandle] = useState("");
  const [type, setType] = useState<ActivityType>("TWEET");
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CreateActivityDto) => api.activities.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setHandle("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ handle, type });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Submit Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2 }}
      >
        <TextField
          label="Handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={type}
            label="Activity Type"
            onChange={(e) => setType(e.target.value as ActivityType)}
          >
            <MenuItem value="TWEET">Tweet</MenuItem>
            <MenuItem value="RETWEET">Retweet</MenuItem>
            <MenuItem value="REPLY">Reply</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ minWidth: 120 }}
        >
          Submit
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error submitting activity
        </Typography>
      )}
    </Paper>
  );
};
