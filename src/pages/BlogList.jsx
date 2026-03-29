import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetBlogListAdmin } from "@/hooks/blogHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function BlogList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: blogListData, isFetching, refetch } = useGetBlogListAdmin({ page, limit });
    

    const clList = useMemo(() => {
        if (!isFetching && blogListData) {
            return blogListData?.data?.map(blog => ({
                id: blog._id,
                title: blog.title,
                coverImage: blog.coverImage,
                createdAt: blog.createdAt
            }));
        }
    }, [blogListData, isFetching])

    useEffect(() => {
        if (!isFetching && blogListData) {

            setTotalPages(blogListData?.pagination?.totalPage || 0);
            setTotalData(blogListData?.pagination?.totalRows || 0);
        }
    }, [blogListData, isFetching])




    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
        },
        {
            name: 'Image',
             cell: (row) => (
                <div>
                    <img src={apiImageWrapper(row.coverImage)} style={{width:"55%"}} alt="" srcset="" />
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
                            onClick={() => navigate(`/blog/edit/${row.id}`)}
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
    const handleEdit = (user) => {
        navigate(`/users/edit/${user.id}`);
    };


    return (
        <div>
            <div className="header">
                <h1>Blogs</h1>
                <button className="btn btn-primary" onClick={() => navigate('/blogs/add')}>
                    Add New Blog
                </button>
            </div>
            {loading && <FullPageLoader />}
            <div className="content-card">
                <h2>Blog List</h2>
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

export default BlogList;
