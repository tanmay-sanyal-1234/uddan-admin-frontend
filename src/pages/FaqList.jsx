import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetFaqListAdmin } from "@/hooks/blogHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function FaqList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: useGetFaqListAdminList, isFetching, refetch } = useGetFaqListAdmin({ page, limit });
    

    const clList = useMemo(() => {
        if (!isFetching && useGetFaqListAdminList) {
            return useGetFaqListAdminList?.data?.map(blog => ({
                id: blog._id,
                question: blog.question,
                answer: blog.answer,
                createdAt: blog.createdAt
            }));
        }
    }, [useGetFaqListAdminList, isFetching])

    useEffect(() => {
        if (!isFetching && useGetFaqListAdminList) {

            setTotalPages(useGetFaqListAdminList?.pagination?.totalPage || 0);
            setTotalData(useGetFaqListAdminList?.pagination?.totalRows || 0);
        }
    }, [useGetFaqListAdminList, isFetching])




    const columns = [
        {
            name: 'Question',
            selector: row => row.question,
            wrap: true,
        },
        {
            name: 'Answer',
            selector: row => row.answer,
            wrap: true,
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
                            onClick={() => navigate(`/faqs/edit/${row.id}`)}
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
                <h1>FAQs</h1>
                <button className="btn btn-primary" onClick={() => navigate('/faqs/add')}>
                    Add New FAQ
                </button>
            </div>
            {loading && <FullPageLoader />}
            <div className="content-card">
                <h2>FAQ List</h2>
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

export default FaqList;
