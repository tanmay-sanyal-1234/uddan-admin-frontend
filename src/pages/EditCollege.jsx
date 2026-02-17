import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { z } from "zod";
import { toast } from "react-toastify";
import FullPageLoader from "@/components/FullPageLoader";
import {
    useGetCityState,
    useGetCollegeById,
    useUpdateCollegeInfo,
} from "@/hooks/collegeHook";
import {apiImageWrapper} from "@/utils/helpers";

function EditCollege() {
    const { id } = useParams();
    const navigate = useNavigate();

    const MAX_LOGO_SIZE = 2 * 1024 * 1024;
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024;

    const { data: cityStateData ,isFetching:isFetchingCityState} = useGetCityState();
    const { data: collegeData, isFetching } = useGetCollegeById(id);
    const { mutateAsync: updateCollege } = useUpdateCollegeInfo(id);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        website: "",
        addressLine1: "",
        addressLine2: "",
        city: null,
        state: null,
        country: "India",
        pincode: "",
        lat: "",
        long: "",
    });

    const [files, setFiles] = useState({
        logo: null,
        brochure: null,
        collegeImage: null,
    });

    const [errors, setErrors] = useState({});

    // =========================
    // ZOD (files optional in edit)
    // =========================
    const collegeSchema = z.object({
        name: z.string().min(3),
        phone: z.string().min(10),
        email: z.string().email(),
        website: z.string().optional().or(z.literal("")),
        addressLine1: z.string().min(3),
        addressLine2: z.string().optional(),
        state: z.object({ value: z.string(), label: z.string() }),
        city: z.object({ value: z.string(), label: z.string() }),
        pincode: z.string().min(4),
        logo: z.instanceof(File).optional(),
        brochure: z.instanceof(File).optional(),
        collegeImage: z.instanceof(File).optional(),
    });

    // =========================
    // Pre-fill Data
    // =========================
    useEffect(() => {
        console.log(collegeData,"collegeData")
        if (collegeData && cityStateData && !isFetchingCityState) {
            const stateObj = cityStateData.find(
                (s) => s._id === collegeData?.data.address.state
            );

            const cityObj = stateObj?.cities.find(
                (c) => c._id === collegeData?.data.address.city
            );

            setForm({
                name: collegeData?.data.name,
                phone: collegeData?.data.phone,
                email: collegeData?.data.email,
                website: collegeData?.data.website || "",
                addressLine1: collegeData?.data.address.line1,
                addressLine2: collegeData?.data.address.line2,
                state: stateObj
                    ? { value: stateObj._id, label: stateObj.name }
                    : null,
                city: cityObj
                    ? { value: cityObj._id, label: cityObj.name }
                    : null,
                pincode: collegeData?.data.address.pincode,
                country: collegeData?.data.address.country,
                lat: collegeData?.data.lat,
                long: collegeData?.data.long,
            });
        }
    }, [collegeData, cityStateData,isFetchingCityState]);

    // =========================
    // Options
    // =========================
    const stateOption = useCallback(() => {
        return cityStateData
            ? cityStateData.map((s) => ({
                value: s._id,
                label: s.name,
            }))
            : [];
    }, [cityStateData]);

    const cityOption = useCallback(() => {
        if (!form.state) return [];

        const state = cityStateData?.find(
            (s) => s._id === form.state.value
        );

        return state
            ? state.cities.map((c) => ({
                value: c._id,
                label: c.name,
            }))
            : [];
    }, [form.state, cityStateData]);

    // =========================
    // Submit
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            logo: files.logo || undefined,
            brochure: files.brochure || undefined,
            collegeImage: files.collegeImage || undefined,
        };

        // const payload = {
        //     ...form,
        //     logo: files.logo,
        //     brochure: files.brochure,
        //     collegeImage: files.collegeImage,
        // };

        const parsed = collegeSchema.safeParse(payload);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const formatted = {};
            Object.keys(fieldErrors).forEach((key) => {
                formatted[key] = fieldErrors[key][0];
            });
            setErrors(formatted);
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append("name", form.name);
        data.append("phone", form.phone);
        data.append("email", form.email);
        data.append("website", form.website);

        data.append("address[line1]", form.addressLine1);
        data.append("address[line2]", form.addressLine2);
        data.append("address[city]", form.city.value);
        data.append("address[state]", form.state.value);
        data.append("address[country]", form.country);
        data.append("address[pincode]", form.pincode);

        data.append("lat", form.lat);
        data.append("long", form.long);

        if (files.logo) data.append("logo", files.logo);
        if (files.brochure) data.append("brochure", files.brochure);
        if (files.collegeImage)
            data.append("thumbnail", files.collegeImage);

        try {
            await updateCollege(data);
            toast.success("College updated successfully!");
            navigate("/college");
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

        const logoValidation = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, logo: "Only JPG, PNG, JPEG files are allowed" }));
        } else {
            setErrors(prev => ({ ...prev, logo: null }));
        }
    }

    const brochureValidation = (file) => {
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, brochure: "Only PDF files are allowed" }));
        } else {

            setErrors(prev => ({ ...prev, brochure: null }));
        }
    }

    const handleChange = (e) => {
        console.log("ddddd",e)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }; 

    if (isFetching) return <FullPageLoader />;

    return (
        <div>
            <div className="header">
                <h1>Edit College</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}
                <Form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>College Name <span className='text-danger'>*</span></label>
                            <input name="name" onChange={handleChange} value={form.name}/>
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label>Phone <span className='text-danger'>*</span></label>
                            <input name="phone" onChange={handleChange} value={form.phone}/>
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email <span className='text-danger'>*</span></label>
                            <input name="email" onChange={handleChange} value={form.email}/>
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input name="website" onChange={handleChange} value={form.website}/>
                            {errors.website && <small className="text-danger">{errors.website}</small>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Line 1 <span className='text-danger'>*</span></label>
                        <input name="addressLine1" onChange={handleChange} value={form.addressLine1}/>
                        {errors.addressLine1 && <small className="text-danger">{errors.addressLine1}</small>}
                    </div>

                    <div className="form-group">
                        <label>Address Line 2</label>
                        <input name="addressLine2" onChange={handleChange} value={form.addressLine2}/>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>State <span className='text-danger'>*</span></label>
                            <Select
                                name="state"
                                value={form.state}
                                isLoading={isFetching}
                                onChange={(selected) => {
                                    console.log(selected, "selected")
                                    setForm({
                                        ...form,
                                        state: selected,
                                        city: null, // 🔥 reset city on state change
                                    })
                                }}
                                options={stateOption()}
                            />
                            {errors.state && <small className="text-danger">{errors.state}</small>}
                        </div>
                        <div className="form-group">
                            <label>City <span className='text-danger'>*</span></label>
                            <Select
                                name="city"
                                value={form.city}
                                onChange={(selected) =>
                                    setForm({ ...form, city: selected })
                                }
                                isDisabled={!form.state}
                                options={cityOption()}
                            />
                            {errors.city && <small className="text-danger">{errors.city}</small>}
                        </div>


                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Pincode <span className='text-danger'>*</span></label>
                            <input name="pincode" onChange={handleChange}  value={form.pincode}/>
                            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input value="India" readOnly />
                        </div>
                    </div>

                    
                    <div className="form-row">
                        <div className="form-group">
                            {collegeData?.data?.logo && (
                                <img src={apiImageWrapper(collegeData?.data?.logo)} width={100} alt="" />
                            )}
                            <label>Logo <span className='text-danger'></span><small className='text-primary'>(Only JPG , PNG , JPEG file allowed)</small></label>
                            <input type="file" name="logo" onChange={(e) => {
                                logoValidation(e.target.files[0]);
                                setFiles({ ...files, logo: e.target.files[0] })
                            }} />
                            {errors.logo && <small className="text-danger">{errors.logo}</small>}
                        </div>
                        <div className="form-group">
                             {collegeData?.data?.thumbnail && (
                                <img src={apiImageWrapper(collegeData?.data?.thumbnail)} width={100} alt="" />
                            )}
                            <label>College Image <small className='text-primary'>(Only JPG , PNG , JPEG file allowed)</small></label>
                            <input type="file" name="collegeImage" onChange={(e) => {
                                logoValidation(e.target.files[0]);
                                setFiles({ ...files, collegeImage: e.target.files[0] })
                            }} />
                            {errors.collegeImage && <small className="text-danger">{errors.collegeImage}</small>}
                        </div>

                        <div className="form-group">
                             {collegeData?.data?.media?.brochureUrl && (
                                <a href={collegeData?.data?.media?.brochureUrl} download={true}>Download Brochure</a>
                            )}
                            <label>Brochure <small className='text-primary'>(Only PDF file allowed)</small></label>
                            <input type="file" name='brochure' onChange={(e) => {
                                brochureValidation(e.target.files[0]);
                                setFiles({ ...files, brochure: e.target.files[0] })
                            }} />
                            {errors.brochure && <small className="text-danger">{errors.brochure}</small>}
                        </div>
                    </div>

                    <button className="btn btn-primary" >
                        {/* {mutation.isPending ? "Submitting..." : "Create College"} */} Update
                    </button>
                </Form>
            </div>
        </div>
    );
}

export default EditCollege;
