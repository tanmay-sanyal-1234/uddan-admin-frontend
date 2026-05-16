import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import { useGetAdvertismentDetails, useUpdateAdvertisment } from "@/hooks/advertismentHook";
import { apiImageWrapper } from '@/utils/helpers';

function EditAdvertiseBanner() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        redirectUrl: '',
        image: null,
        preview: null
    });

    const { data: adDetails, isLoading: isDetailsLoading } = useGetAdvertismentDetails(id);
    const { mutateAsync: updateAd } = useUpdateAdvertisment(id);

    useEffect(() => {
        if (adDetails?.data) {
            setFormData({
                redirectUrl: adDetails.data.redirectUrl || '',
                image: null,
                preview: apiImageWrapper(adDetails.data.image)
            });
        }
    }, [adDetails]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('redirectUrl', formData.redirectUrl);
        if (formData.image) {
            data.append('image', formData.image);
        }

        setLoading(true);
        try {
            const res = await updateAd(data);
            if (res.success) {
                toast.success("Banner updated successfully");
                navigate('/advertisments');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update banner");
        } finally {
            setLoading(false);
        }
    };

    if (isDetailsLoading) return <FullPageLoader />;

    return (
        <div>
            <div className="header">
                <h1>Edit Advertise Banner</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Banner Image</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />
                                <Form.Text className="text-muted">
                                    Leave blank to keep existing image
                                </Form.Text>
                                {formData.preview && (
                                    <div className="mt-3">
                                        <p>Current Preview:</p>
                                        <img 
                                            src={formData.preview} 
                                            alt="Preview" 
                                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Redirect URL</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="redirectUrl"
                                    placeholder="https://example.com" 
                                    value={formData.redirectUrl} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mt-4">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Banner'}
                        </Button>
                        <Button variant="secondary" className="ms-2" onClick={() => navigate('/advertisments')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default EditAdvertiseBanner;
