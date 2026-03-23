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