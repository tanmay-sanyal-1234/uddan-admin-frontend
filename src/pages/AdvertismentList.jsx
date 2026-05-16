import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetAdvertismentListAdmin, useRemoveAdvertisment } from "@/hooks/advertismentHook";
import moment from "moment";
import { apiImageWrapper } from '@/utils/helpers';
import { toast } from 'react-toastify';

function AdvertismentList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const { data: adsData, isFetching, refetch } = useGetAdvertismentListAdmin({ page, limit });
    const { mutateAsync: removeAd } = useRemoveAdvertisment();

    const clList = useMemo(() => {
        if (!isFetching && adsData) {
            return adsData?.data?.map(ad => ({
                id: ad._id,
                image: ad.image,
                redirectUrl: ad.redirectUrl,
                createdAt: ad.createdAt
            }));
        }
        return [];
    }, [adsData, isFetching])

    useEffect(() => {
        if (!isFetching && adsData) {
            setTotalData(adsData?.pagination?.totalRows || 0);
        }
    }, [adsData, isFetching])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                const res = await removeAd(id);
                if (res.success) {
                    toast.success("Banner deleted successfully");
                    refetch();
                } else {
                    toast.error("Delete failed");
                }
            } catch (error) {
                toast.error("An error occurred");
            }
        }
    };

    const columns = [
        {
            name: 'Banner',
            cell: row => (
                <div className="p-2">
                    <img
                        src={apiImageWrapper(row.image)}
                        alt="Banner"
                        style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
                    />
                </div>
            ),
            width: '150px'
        },
        {
            name: 'Redirect URL',
            selector: row => row.redirectUrl || '-',
            wrap: true,
        },
        {
            name: 'Created At',
            selector: row => moment(row.createdAt).format("DD-MM-YYYY HH:mm"),
            sortable: true
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action-wrapper">
                    <button className="action-btn">⋮</button>
                    <div className="action-menu">
                        <div
                            className="action-item"
                            onClick={() => navigate(`/advertisments/edit/${row.id}`)}
                        >
                            <i className="fa fa-edit"></i> Edit
                        </div>
                        <div
                            className="action-item delete"
                            onClick={() => handleDelete(row.id)}
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

    return (
        <div>
            <div className="header">
                <h1>Advertise Banners</h1>
                <button className="btn btn-primary" onClick={() => navigate('/advertisments/add')}>
                    Add New Banners
                </button>
            </div>
            {(isFetching) && <FullPageLoader />}
            <div className="content-card">
                <h2>Banner List</h2>
                <DataTable
                    progressPending={isFetching}
                    columns={columns}
                    data={clList}
                    paginationServer
                    pagination
                    highlightOnHover
                    pointerOnHover
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                    paginationTotalRows={totalData}
                />
            </div>
        </div>
    );
}

export default AdvertismentList;
