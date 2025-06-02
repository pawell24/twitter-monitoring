import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { api } from "../services/api";
import type { Profile } from "../types";

export const ProfileList = () => {
  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: api.profiles.getAll,
  });

  if (isLoading) {
    return <Typography>Loading profiles...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading profiles</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Handle</TableCell>
            <TableCell align="right">Activity Count</TableCell>
            <TableCell align="right">Last Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.handle}>
              <TableCell component="th" scope="row">
                {profile.handle}
              </TableCell>
              <TableCell align="right">{profile.activityCount}</TableCell>
              <TableCell align="right">
                {profile.lastActivity
                  ? format(new Date(profile.lastActivity), "PPpp")
                  : "Never"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
