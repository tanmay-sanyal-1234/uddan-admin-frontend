import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetNewLetterListAdmin } from "@/hooks/inqueryHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function NewsLetterList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: cList, isFetching, refetch } = useGetNewLetterListAdmin({ page, limit });

    const clList = useMemo(() => {
        if (!isFetching && cList) {
            return cList?.data?.map(lead => ({
                id: lead._id,
                email: lead.email,
                createdAt: lead.createdAt
            }));
        }
    }, [cList, isFetching])

    useEffect(() => {
        if (!isFetching && cList) {

            setTotalPages(cList?.pagination?.totalPage || 0);
            setTotalData(cList?.pagination?.totalRows || 0);
        }
    }, [cList, isFetching])




    const columns = [
        {
            name: 'Email',
            selector: row => row.email,
            wrap: true,
        },
        {
            name: 'createdAt',
            selector: row => momemnt(row.createdAt).format("DD-MM-YYYY"),
        },
        // {
        //     name: "Action",
        //     cell: (row) => (
        //         <div className="action-wrapper">
        //             <button className="action-btn">⋮</button>
        //             <div className="action-menu">
        //                 <div
        //                     className="action-item delete"
        //                     onClick={() =>
        //                         ConfirmDeleteToast(() => handleDelete(row.id))
        //                     }
        //                 >
        //                    <i className="fa fa-trash"></i> Delete
        //                 </div>
        //             </div>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // }
    ];
    const handleEdit = (user) => {
        navigate(`/users/edit/${user.id}`);
    };

    const handleDelete = async(id) => {
        setLoading(true);
        await useLeadDeleteUpdate(id, {
            onSuccess: (data) => {
                setLoading(false);
                console.log(data, "success")
                toast.success("Lead deleted successfully");
            },
            onError: (error) => {
                setLoading(false);
                    toast.error("Failed to delete");
                console.log(error, "error")
            }
        })
    };

    return (
        <div>
            <div className="header">
                <h1>News Letter</h1>
                
            </div>
            {loading && <FullPageLoader />}
            <div className="content-card">
                <h2>News Letter List</h2>
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

export default NewsLetterList;
