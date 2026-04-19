import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetTestimonialListAdmin } from "@/hooks/blogHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function TestimonialsList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: useGetTestimonialListAdminList, isFetching, refetch } = useGetTestimonialListAdmin({ page, limit });
    

    const clList = useMemo(() => {
        if (!isFetching && useGetTestimonialListAdminList) {
            return useGetTestimonialListAdminList?.data?.map(blog => ({
                id: blog._id,
                name: blog.name,
                iamge: blog.iamge,
                createdAt: blog.createdAt
            }));
        }
    }, [useGetTestimonialListAdminList, isFetching])

    useEffect(() => {
        if (!isFetching && useGetTestimonialListAdminList) {

            setTotalPages(useGetTestimonialListAdminList?.pagination?.totalPage || 0);
            setTotalData(useGetTestimonialListAdminList?.pagination?.totalRows || 0);
        }
    }, [useGetTestimonialListAdminList, isFetching])




    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Image',
             cell: (row) => (
                <div>
                    <img src={apiImageWrapper(row.iamge)} style={{width:"55%"}} alt="" srcset="" />
                </div>
            ),
        },
        {
            name: 'createdAt',
            selector: row => momemnt(row.createdAt).format("DD-MM-YYYY"),
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action-wrapper">
                    <button className="action-btn">⋮</button>
                    <div className="action-menu">
                        <div
                            className="action-item"
                            onClick={() => navigate(`/testimonials/edit/${row.id}`)}
                        >
                           <i className="fa fa-edit"></i> Edit
                        </div>
                    </div>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];
    


    return (
        <div>
            <div className="header">
                <h1>Testimonials</h1>
                <button className="btn btn-primary" onClick={() => navigate('/testimonials/add')}>
                    Add New Testimonial
                </button>
            </div>
            {loading && <FullPageLoader />}
            <div className="content-card">
                <h2>Testimonial List</h2>
                <DataTable
                    progressPending={isFetching}
                    columns={columns}
                    data={clList}
                    paginationServer
                    pagination
                    highlightOnHover
                    pointerOnHover
                    // onRowClicked={handleEdit}
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1); // Reset to first page when limit changes
                    }}
                    paginationTotalRows={totalData}

                />
            </div>
        </div>
    );
}

export default TestimonialsList;
