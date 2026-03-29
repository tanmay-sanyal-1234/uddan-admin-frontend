import { useQuery,useMutation ,useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export const useGetInQueryListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetInQueryListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-leads?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 
export const useGetContactUsListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetContactUsListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-contact-us-list?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 
export const useGetNewLetterListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetNewLetterListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-newsletter?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 