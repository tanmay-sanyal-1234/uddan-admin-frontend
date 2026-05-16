import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useAddAdvertisment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["useAddAdvertisment"],
    mutationFn: async (data) => {
      const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/advertisment/create`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["useGetAdvertismentListAdmin"]);
    }
  });
};

export const useUpdateAdvertisment = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["useUpdateAdvertisment", id],
    mutationFn: async (data) => {
      const { data: res } = await axios.put(`${import.meta.env.VITE_ADMIN_API}/advertisment/update/${id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["useGetAdvertismentListAdmin"]);
      queryClient.invalidateQueries(["useGetAdvertismentDetails", id]);
    }
  });
};

export const useGetAdvertismentDetails = (id) => {
  return useQuery({
    queryKey: ["useGetAdvertismentDetails", id],
    queryFn: async () => {
      const { data: res } = await axios.get(`${import.meta.env.VITE_ADMIN_API}/advertisment/${id}`);
      return res;
    },
    enabled: !!id,
  });
};

export const useGetAdvertismentListAdmin = ({ page, limit }) => {
  return useQuery({
    queryKey: ["useGetAdvertismentListAdmin", page, limit],
    queryFn: async () => {
      const { data: res } = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/advertisment/get?page=${page}&limit=${limit}`
      );
      return res;
    }
  });
};

export const useRemoveAdvertisment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["useRemoveAdvertisment"],
    mutationFn: async (id) => {
      const { data: res } = await axios.delete(`${import.meta.env.VITE_ADMIN_API}/remove-advertisment/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["useGetAdvertismentListAdmin"]);
    }
  });
};
