import { useQuery,useMutation ,useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export const useGetCollegeList = (page = 1, limit = 10, filters = "") => {
  return useQuery({
    queryKey: ["useGetCollegeList", page, limit, filters],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/find-collages?page=${page}&limit=${limit}&${filters}`
      );
      return res.data;
    }
  }); 
};

export const useGetCollegeListHome = ({page = 1, limit = 10, courseId}) => {
  return useQuery({
    queryKey: ["useGetCollegeListHome", page, limit, courseId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/find-collages?page=${page}&limit=${limit}&course=${courseId}`
      );
      return res.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  }); 
};

export const useGetCollegeDetailsById = (id) => {
  return useQuery({
    queryKey: ["useGetCollegeDetailsById", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-college/${id}`
      );
      return res.data?.data;
    },
    enabled: !!id
  }); 
};

export const useGetStreams = () => {
  return useQuery({
    queryKey: ["useGetStreams"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/find-streams`
      );
      return res.data?.data;
    }
  }); 
};

export const useGetCityState = () => {
  return useQuery({
    queryKey: ["useGetCityState"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-state-and-cities`
      );
      return res.data?.data;
    }
  }); 
};
export const useGetCity = () => {
  return useQuery({
    queryKey: ["useGetCity"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-cities`
      );
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000 // 30 minutes
  }); 
};

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["useGetCourses"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/find-courses`
      );
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  }); 
};

export const useGetStreamAndCourse = () => {
  return useQuery({
    queryKey: ["useGetStreamAndCourse"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-stream-and-courses`
      );
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  }); 
};

export const useAddCollegeInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddCollegeInfoAdd"],
        mutationFn: async (data) => {
            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/college/create`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}
export const useAddCollegeCourse = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddCollegeCourseAdd"],
        mutationFn: async (data) => {

            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/college/course/add/${id}`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useAddCollegeTab = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddCollegeTabAdd"],
        mutationFn: async (data) => {
          
            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/college/tab/add/${id}`,data);
            return res;
        },
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["useGetCollegeTab", id],
            });

        },
    });

}
export const useGetCollegeListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetCollegeListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/college-list?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
};

export const useGetLeadListAdmin = ({page, limit}) => {
  return useQuery({
    queryKey: ["useGetLeadListAdmin", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/get-leads?page=${page}&limit=${limit}`
      );
      return res.data;
    }
  }); 
};
export const useUpdateCollegeInfo = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useUpdateCollegeInfoUpdate"],
        mutationFn: async (data) => {
            const { data: res } = await axios.put(`${import.meta.env.VITE_ADMIN_API}/college/update/${id}`,data);
            return res;
        }
        // onSuccess: async (data, variables) => {
        //     await queryClient.invalidateQueries({
        //         queryKey: ["getAllInvitations", "RECEIVED"],
        //     });

        // },
    });

}

export const useGetCollegeById = (id) => {
  return useQuery({
    queryKey: ["useGetCollegeById", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/college-view/${id}`
      );
      return res.data;
    },
    enabled:!!id
  }); 
};

export const useLeadDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useLeadDeleteUpdate"],
        mutationFn: async (id) => {
            const { data: res } = await axios.delete(`${import.meta.env.VITE_ADMIN_API}/remove-lead/${id}`);
            return res;
        },
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["useGetLeadListAdmin"],
            });

        },
    });

}

export const useGetCollegeCourses = (id) => {
  return useQuery({
    queryKey: ["useGetCollegeCourses", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/college-coursess/${id}`
      );
      return res.data;
    },
    enabled:!!id
  }); 
};
export const useGetCollegeTab = (id) => {
  return useQuery({
    queryKey: ["useGetCollegeTab", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/college-tabs/${id}`
      );
      return res.data;
    },
    enabled:!!id
  }); 
};
export const useAddCollegeTabEdit = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useAddCollegeTabEditSubmit"],
        mutationFn: async (data) => {
            const { data: res } = await axios.post(`${import.meta.env.VITE_ADMIN_API}/college/tab/add/${id}/${data?.tabId}`,data);
            return res;
        },
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["useGetCollegeTab", id],
            });

        },
    });

}
export const useCollegeDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["useCollegeDeleteUpdate"],
        mutationFn: async (id) => {
            const { data: res } = await axios.delete(`${import.meta.env.VITE_ADMIN_API}/remove-college/${id}`);
            return res;
        },
        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["useGetCollegeListAdmin"],
            });

        },
    });

}
export const useDashboardCount = () => {
  return useQuery({
    queryKey: ["useDashboardCount"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_ADMIN_API}/dashboard-count`
      );
      return res.data?.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000 // 30 minutes
  }); 
};
