import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetCollegeListAdmin ,useCollegeDelete} from "@/hooks/collegeHook";
import momemnt from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import {ConfirmDeleteToast} from '../components/ConfirmDeleteToast'
import { toast } from 'react-toastify';
function Colleges() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const { data: collegeList, isFetching, refetch } = useGetCollegeListAdmin({ page, limit });
    const { mutateAsync: useCollegeDeleteUpdate, isPending } = useCollegeDelete();

    const clList = useMemo(() => {
        if (!isFetching && collegeList) {
            return collegeList?.data?.map(college => ({
                id: college._id,
                name: college.name,
                email: college.email,
                logo: college.logo,
                phone: college.phone,
                createdAt: college.createdAt
            }));
        }
    }, [collegeList, isFetching])

    useEffect(() => {
        if (!isFetching && collegeList) {

            setTotalPages(collegeList?.pagination?.totalPage || 0);
            setTotalData(collegeList?.pagination?.totalRows || 0);
        }
    }, [collegeList, isFetching])


    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joined: '2024-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', joined: '2024-03-10' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active', joined: '2024-04-05' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active', joined: '2024-05-12' },
        { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active', joined: '2024-06-18' },
        { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'User', status: 'Inactive', joined: '2024-07-22' },
        { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'Editor', status: 'Active', joined: '2024-08-30' },
        { id: 9, name: 'George Miller', email: 'george@example.com', role: 'User', status: 'Active', joined: '2024-09-14' },
        { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', role: 'User', status: 'Active', joined: '2024-10-25' },
        { id: 11, name: 'Ian Wright', email: 'ian@example.com', role: 'User', status: 'Inactive', joined: '2024-11-08' },
        { id: 12, name: 'Julia Roberts', email: 'julia@example.com', role: 'Editor', status: 'Active', joined: '2024-12-19' }
    ]);



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
            name: 'Logo',
            selector: row => <img src={apiImageWrapper(row.logo)} alt={row.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
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
                            onClick={() => navigate(`/college-info-edit/${row.id}`)}
                        >
                           <i className="fa fa-edit"></i> Info Edit
                        </div>
                        <div
                            className="action-item"
                            onClick={() => navigate(`/college-course-edit/${row.id}`)}
                        >
                           <i className="fa fa-edit"></i> Course Edit
                        </div>
                        <div
                            className="action-item"
                            onClick={() => navigate(`/college-tab-edit/${row.id}`)}
                        >
                            <i className="fa fa-edit"></i> Tab Edit
                        </div>
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
        await useCollegeDeleteUpdate(id, {
            onSuccess: (data) => {
                setLoading(false);
                console.log(data, "success")
                toast.success("College deleted successfully");
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
                <h1>College Management</h1>
                <button className="btn btn-primary" onClick={() => navigate('/college/add')}>
                    Add New College
                </button>
            </div>
            {loading && isFetching && <FullPageLoader />}
            <div className="content-card">
                <h2>College List</h2>
                <DataTable
                    progressPending={isFetching}
                    columns={columns}
                    data={clList}
                    paginationServer
                    pagination
                    highlightOnHover
                    pointerOnHover
                    onRowClicked={handleEdit}
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

export default Colleges;
