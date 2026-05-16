import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import { useAddAdvertisment } from "@/hooks/advertismentHook";

function AddAdvertiseBanner() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState([{ image: null, redirectUrl: '', preview: null }]);

    const { mutateAsync: addAdvertisment } = useAddAdvertisment();

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newBanners = [...banners];
            newBanners[index].image = file;
            newBanners[index].preview = URL.createObjectURL(file);
            setBanners(newBanners);
        }
    };

    const handleUrlChange = (index, value) => {
        const newBanners = [...banners];
        newBanners[index].redirectUrl = value;
        setBanners(newBanners);
    };

    const addMore = () => {
        setBanners([...banners, { image: null, redirectUrl: '', preview: null }]);
    };

    const removeBanner = (index) => {
        const newBanners = banners.filter((_, i) => i !== index);
        setBanners(newBanners);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validBanners = banners.filter(b => b.image);
        if (validBanners.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        const formData = new FormData();
        validBanners.forEach((banner) => {
            formData.append('image', banner.image);
            formData.append('redirectUrl', banner.redirectUrl);
        });

        setLoading(true);
        try {
            const res = await addAdvertisment(formData);
            if (res.success) {
                toast.success("Banners added successfully");
                navigate('/advertisments');
            } else {
                toast.error(res.message || "Failed to add banners");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add banners");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Add Advertise Banners</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>
                    {banners.map((banner, index) => (
                        <Card key={index} className="mb-4 shadow-sm border-0 bg-light">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Banner Image <span className="text-danger">*</span></Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => handleFileChange(index, e)} 
                                            />
                                            {banner.preview && (
                                                <div className="mt-2 text-center">
                                                    <img 
                                                        src={banner.preview} 
                                                        alt="Preview" 
                                                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', border: '1px solid #ddd' }} 
                                                    />
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Redirect URL</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="https://example.com" 
                                                value={banner.redirectUrl} 
                                                onChange={(e) => handleUrlChange(index, e.target.value)} 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="text-end">
                                        {banners.length > 1 && (
                                            <Button variant="outline-danger" onClick={() => removeBanner(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-primary" onClick={addMore}>
                            + Add Another Banner
                        </Button>
                        <Button type="submit" variant="primary" size="lg" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit All Banners'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default AddAdvertiseBanner;
