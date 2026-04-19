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

export const useGetBlogDetails = (id) => {
  return useQuery({
    queryKey: ["useGetBlogDetails", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-blog/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  }); 
};

export const useGetBlogListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetBlogListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-blogs?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 

export const useUpdateBlog = (blogId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateBlog"],
        mutationFn: async (data) => {
            console.log(blogId)
            const { data: res } = await axios.put(`${import.meta.env.VITE_ADMIN_API}/blog/update/${blogId}`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useAddTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddTestimonialAdd"],
        mutationFn: async (data) => {

            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/testimonial/create`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useUpdateTestimonial = (testimonialId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateTestimonial"],
        mutationFn: async (data) => {
           
            const { data: res } = await axios.put(`${import.meta.env.VITE_ADMIN_API}/testimonial/update/${testimonialId}`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useGetTestimonialDetails = (id) => {
  return useQuery({
    queryKey: ["useGetTestimonialDetails", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/testimonial/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  }); 
};

export const useGetTestimonialListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetTestimonialListAdminList", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/testimonial/get?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 

export const useAddFAQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddFAQSubmit"],
        mutationFn: async (data) => {

            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/faq/create`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useGetFAQDetails = (id) => {
  return useQuery({
    queryKey: ["useGetFAQDetailsData", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/faq/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  }); 
};

export const useUpdateFAQ = (faqId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateFAQ"],
        mutationFn: async (data) => {
           
            const { data: res } = await axios.put(`${import.meta.env.VITE_ADMIN_API}/faq/update/${faqId}`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useGetFaqListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetFaqListAdminList", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/faq/get?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
}; 