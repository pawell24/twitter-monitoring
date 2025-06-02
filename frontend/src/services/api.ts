import axios from "axios";
import type { Profile, CreateActivityDto, Alert } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  profiles: {
    getAll: async (): Promise<Profile[]> => {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    },
  },
  alerts: {
    getInactive: async (): Promise<Alert[]> => {
      const response = await axios.get(`${API_URL}/alerts`);
      return response.data;
    },
  },
  activities: {
    create: async (data: CreateActivityDto): Promise<void> => {
      await axios.post(`${API_URL}/activity`, data);
    },
  },
};
