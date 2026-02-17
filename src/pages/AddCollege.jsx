import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from "react-bootstrap";
import Select from 'react-select';
import { useGetCityState, useGetStreams, useAddCollegeInfo } from "@/hooks/collegeHook";
import { z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
function AddCollege() {
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
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
        lat: "22.6960155",
        long: "88.4694525",
        logo: null,
        brochure: null,
    });
    const { data: cityStateData, isFetching } = useGetCityState();
    const { mutateAsync: useAddCollegeInfoAdd, isPending } = useAddCollegeInfo();
    const [loading , setLoading] = useState(false);
    const collegeSchema = z.object({
        name: z.string().min(3, "College name is required"),
        phone: z.string().min(10, "Invalid phone number"),
        email: z.string().min(1, "Email is required"),
        website: z.string().url("Invalid website").optional().or(z.literal("")),
        addressLine1: z.string().min(3, "Address is required"),
        addressLine2: z.string().optional(),
        state: z
            .object({
                value: z.string(),
                label: z.string(),
            })
            .nullable()
            .refine(Boolean, { message: "State is required" }),

        city: z
            .object({
                value: z.string(),
                label: z.string(),
            })
            .nullable()
            .refine(Boolean, { message: "City is required" }),
        pincode: z.string().min(4, "Invalid pincode"),
        country: z.string(),
        lat: z.string().optional(),
        long: z.string().optional(),
        logo: z
            .instanceof(File)
            .refine(
                (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
                "Only JPG, JPEG, PNG files are allowed"
            )
            .refine(
                (file) => file.size <= MAX_LOGO_SIZE,
                "Logo must be less than 2MB"
            ),
            collegeImage: z
            .instanceof(File)
            .refine(
                (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
                "Only JPG, JPEG, PNG files are allowed"
            )
            .refine(
                (file) => file.size <= MAX_LOGO_SIZE,
                "College Image must be less than 2MB"
            ),

        brochure: z
            .instanceof(File)
            .refine(
                (file) => file.type === "application/pdf",
                "Only PDF files are allowed"
            )
            .refine(
                (file) => file.size <= MAX_BROCHURE_SIZE,
                "Brochure must be less than 5MB"
            )
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };



    const stateOption = useCallback(() => {
        if (!isFetching && cityStateData) {
            return cityStateData.map(state => ({ value: state._id, label: state.name }));
        } else {
            return [];
        }
    }, [isFetching, cityStateData])

    const cityOption = useCallback(() => {
        if (cityStateData && form.state) {
            const state = cityStateData.find(s => s._id === form.state?.value);
            if (state) {
                return state.cities.map(city => ({ value: city._id, label: city.name }));
            } else {
                return [];
            }
        } else {
            return [];
        }
    }, [form.state, cityStateData])




    const [files, setFiles] = useState({
        logo: null,
        brochure: null,
        collegeImage: null,
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            logo: files.logo,
            brochure: files.brochure,
            collegeImage: files.collegeImage,

        };
        const parsed = collegeSchema.safeParse(payload);

        console.log(parsed?.error, "parsed")

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;

            const formattedErrors = {};
            Object.keys(fieldErrors).forEach((key) => {
                formattedErrors[key] = fieldErrors[key][0];
            });

            setErrors(formattedErrors);
            return;
        }


        setErrors({});
        setLoading(true);
        const data = new FormData();
        data.append("name", form.name);
        data.append("phone", form.phone);
        data.append("email", form.email);
        data.append("website", form.website);

        data.append("address[line1]", form.addressLine1);
        data.append("address[line2]", form.addressLine2);
        data.append("address[city]", form.city?.value);
        data.append("address[state]", form.state?.value);
        data.append("address[country]", form.country);
        data.append("address[pincode]", form.pincode);

        data.append("lat", form.lat);
        data.append("long", form.long);

        if (files.logo) data.append("logo", files.logo);
        if (files.brochure) data.append("brochure", files.brochure);
        if (files.collegeImage) data.append("thumbnail", files.collegeImage);

        // mutation.mutate(data);







        await useAddCollegeInfoAdd(data, {
            onSuccess: (data) => {
                setLoading(false);
                console.log(data, "success")
                toast.success("College info added successfully! You can now add courses and tabs for this college.");
                navigate("/college/add-course/" + data?.data?._id);
            },
            onError: (error) => {
                setLoading(false);
                    toast.error("Failed to add college info. Please try again.");
                console.log(error, "error")
            }
        })









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

    return (
        <div>
            <div className="header">
                <h1>Add New College</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}
                <h2>College Information</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>College Name <span className='text-danger'>*</span></label>
                            <input name="name" onChange={handleChange} />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label>Phone <span className='text-danger'>*</span></label>
                            <input name="phone" onChange={handleChange} />
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email <span className='text-danger'>*</span></label>
                            <input name="email" onChange={handleChange} />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input name="website" onChange={handleChange} />
                            {errors.website && <small className="text-danger">{errors.website}</small>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Line 1 <span className='text-danger'>*</span></label>
                        <input name="addressLine1" onChange={handleChange} />
                        {errors.addressLine1 && <small className="text-danger">{errors.addressLine1}</small>}
                    </div>

                    <div className="form-group">
                        <label>Address Line 2</label>
                        <input name="addressLine2" onChange={handleChange} />
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
                            <input name="pincode" onChange={handleChange} />
                            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input value="India" readOnly />
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group">
                            <label>Logo <span className='text-danger'>*</span><small className='text-primary'>(Only JPG , PNG , JPEG file allowed)</small></label>
                            <input type="file" name="logo" onChange={(e) => {
                                logoValidation(e.target.files[0]);
                                setFiles({ ...files, logo: e.target.files[0] })
                            }} />
                            {errors.logo && <small className="text-danger">{errors.logo}</small>}
                        </div>
                        <div className="form-group">
                            <label>College Image <span className='text-danger'>*</span><small className='text-primary'>(Only JPG , PNG , JPEG file allowed)</small></label>
                            <input type="file" name="collegeImage" onChange={(e) => {
                                logoValidation(e.target.files[0]);
                                setFiles({ ...files, collegeImage: e.target.files[0] })
                            }} />
                            {errors.collegeImage && <small className="text-danger">{errors.collegeImage}</small>}
                        </div>

                        <div className="form-group">
                            <label>Brochure <span className='text-danger'>*</span><small className='text-primary'>(Only PDF file allowed)</small></label>
                            <input type="file" name='brochure' onChange={(e) => {
                                brochureValidation(e.target.files[0]);
                                setFiles({ ...files, brochure: e.target.files[0] })
                            }} />
                            {errors.brochure && <small className="text-danger">{errors.brochure}</small>}
                        </div>
                    </div>

                    <button className="btn btn-primary" >
                        {/* {mutation.isPending ? "Submitting..." : "Create College"} */} Save College & Next
                    </button>
                </Form>
















            </div>
        </div>
    );
}

export default AddCollege;
