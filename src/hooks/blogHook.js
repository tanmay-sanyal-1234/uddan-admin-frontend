import { useQuery,useMutation ,useQueryClient} from "@tanstack/react-query";
import axios from "axios";


export const useAddBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddBlogAdd"],
        mutationFn: async (data) => {

            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/blog/create`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}
export const useBlogPublish = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useBlogPublishAdd"],
        mutationFn: async (data) => {

            const { data: res } = await axios.patch(`${import.meta.env.VITE_ADMIN_API}/blog/publish/${data.id}`);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}