import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetLeadListAdmin,useLeadDelete } from "@/hooks/collegeHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function InqueryList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: leadList, isFetching, refetch } = useGetLeadListAdmin({ page, limit });
    const { mutateAsync: useLeadDeleteUpdate, isPending } = useLeadDelete();

    const clList = useMemo(() => {
        if (!isFetching && leadList) {
            return leadList?.data?.map(lead => ({
                id: lead._id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                courseD: lead.courseD,
                collegeD: lead.collegeD,
                cityD: lead.cityD,
                stateD: lead.stateD,
                createdAt: lead.createdAt
            }));
        }
    }, [leadList, isFetching])

    useEffect(() => {
        if (!isFetching && leadList) {

            setTotalPages(leadList?.pagination?.totalPage || 0);
            setTotalData(leadList?.pagination?.totalRows || 0);
        }
    }, [leadList, isFetching])




    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Phone Number',
            selector: row => row.phone,
        },
        {
            name: 'Course',
            selector: row => row?.courseD?.name || "N/A",
        },
        {
            name: 'College',
            selector: row => row?.collegeD?.name || "N/A",
        },
        {
            name: 'City',
            selector: row => row?.cityD?.name || "N/A",
        },
        // {
        //     name: 'State',
        //     selector: row => row?.stateD?.name || "N/A",
        // },
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
                            className="action-item delete"
                            onClick={() =>
                                ConfirmDeleteToast(() => handleDelete(row.id))
                            }
                        >
                           <i className="fa fa-trash"></i> Delete
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
                <h1>Lead Management</h1>
                
            </div>
            {loading && <FullPageLoader />}
            <div className="content-card">
                <h2>Lead List</h2>
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

export default InqueryList;
