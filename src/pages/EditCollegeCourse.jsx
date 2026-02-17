import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import Select from 'react-select';
import { useGetCityState, useGetStreamAndCourse, useAddCollegeCourse, useGetCollegeCourses } from "@/hooks/collegeHook";
import { z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
function EditCollegeCourse() {
    const { collegeId } = useParams();
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const emptyRow = {
        stream: null,
        course: null,
        fees: "",
        eligibility: "",
    };
    const [rows, setRows] = useState([emptyRow]);
    const [anyErrors, setAnyErrors] = useState(false);
    const courseRowSchema = z.object({
        streamId: z.string().min(1, "Stream is required"),
        courseId: z.string().min(1, "Course is required"),
        fees: z.number({ invalid_type_error: "Fees must be a number" }).positive("Fees must be greater than 0"),
        eligibility: z.string().min(1, "Eligibility is required"),
    });

    const courseArraySchema = z
        .array(courseRowSchema)
        .min(1, "At least one course is required");
    const { data: streamAndCourseData, isFetching: isStreamAndCourseFetching } = useGetStreamAndCourse();
    const { data: getCourse, isFetching: isGetCourseFetching } = useGetCollegeCourses(collegeId);
    const { mutateAsync: useAddCollegeCourseAdd, isPending } = useAddCollegeCourse(collegeId);




    const streamOption = useCallback(() => {
        if (!isStreamAndCourseFetching && streamAndCourseData) {
            return streamAndCourseData.map(stream => ({ value: stream._id, label: stream.name }));
        } else {
            return [];
        }
    }, [isStreamAndCourseFetching, streamAndCourseData])
    const courseOption = useCallback((id) => {
        console.log("Calculating course options for stream ID:", id);
        if (id === null) return [];
        const stream = streamAndCourseData.find(s => s._id === id?.value);
        if (stream) {
            return stream.courses.map(course => ({ value: course._id, label: course.name }));
        } else {
            return [];
        }
    }, [streamAndCourseData])


    useEffect(() => {
        if (!isGetCourseFetching && getCourse) {
            const prefillData = getCourse?.data?.map(item => {
                const stream = streamAndCourseData.find(s => s._id === item.stream);
                const course = stream?.courses.find(c => c._id === item.course);
                return {
                    stream: stream ? { value: stream._id, label: stream.name } : null,
                    course: course ? { value: course._id, label: course.name } : null,
                    fees: item.fees || "",
                    eligibility: item.eligibility || "",
                };
            });
            setRows(prefillData.length > 0 ? prefillData : [emptyRow]);
        }
    }, [getCourse, isGetCourseFetching])






    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(rows, "row");
        const payload = rows.map((row) => ({
            streamId: row.stream?.value || "",
            courseId: row.course?.value || "",
            fees: parseFloat(row?.fees || 0),
            eligibility: row?.eligibility,
        }));

        const parsed = courseArraySchema.safeParse(payload);
        console.log(parsed.error)
        console.log("FINAL PAYLOAD 👉", payload);
        setAnyErrors(false);
        if (!parsed.success) {
            setAnyErrors(true);
            return;
        }

        if (!anyErrors) {
            setLoading(true);
            await useAddCollegeCourseAdd((payload), {

                onSuccess: (data) => {
                    console.log(data, "success")
                    setLoading(false);
                    toast.success("College courses updated successfully!");
                    navigate("/college");
                },
                onError: (error) => {
                    setLoading(false);
                    toast.error("Failed to update college courses. Please try again.");
                    console.log(error, "error")
                }
            })


        } else {
            toast.error("Please fix validation errors before submitting.");
        }

    };











    const handleAddRow = () => {
        setRows([...rows, emptyRow]);
    };

    const handleRemoveRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };
    const updateRow = (index, key, value) => {
        const updated = [...rows];
        updated[index][key] = value;

        // Reset course when stream changes
        if (key === "stream") {
            updated[index].course = null;
        }

        setRows(updated);
    };




    return (
        <div>
            <div className="header">
                <h1>Update and New College Course</h1>
            </div>

            <div className="content-card">
                {loading && isGetCourseFetching && <FullPageLoader />}
                <h2>College Course Information</h2>
                <Form onSubmit={handleSubmit}>
                    {rows.map((row, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">
                            <div className="row g-3 align-items-end">

                                <div className="col-md-3">
                                    <Form.Label>Stream <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        value={row.stream}
                                        isLoading={isStreamAndCourseFetching}
                                        options={streamOption()}
                                        onChange={(val) => updateRow(index, "stream", val)}
                                        placeholder="Select Stream"
                                    />
                                    {errors[index]?.streamId && (<small className="text-danger">{errors[index].streamId}</small>)}
                                </div>

                                <div className="col-md-3">
                                    <Form.Label>Course <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        value={row.course}
                                        options={courseOption(row.stream)}
                                        onChange={(val) => updateRow(index, "course", val)}
                                        placeholder="Select Course"
                                        isDisabled={!row.stream}
                                    />
                                    {errors[index]?.courseId && (<small className="text-danger">{errors[index].courseId}</small>)}
                                </div>

                                <div className="col-md-2">
                                    <Form.Label>Eligibility <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        value={row.eligibility}
                                        onChange={(e) =>
                                            updateRow(index, "eligibility", e.target.value)
                                        }
                                        placeholder="12+"
                                    />
                                    {errors[index]?.eligibility && (<small className="text-danger">{errors[index].eligibility}</small>)}
                                </div>

                                <div className="col-md-2">
                                    <Form.Label>Fees <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        value={row.fees}
                                        onChange={(e) =>
                                            updateRow(index, "fees", e.target.value)
                                        }
                                        placeholder="100000"
                                    />
                                    {errors[index]?.fees && (<small className="text-danger">{errors[index].fees}</small>)}
                                </div>

                                <div className="col-md-2 d-flex gap-2">
                                    {rows.length > 1 && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleRemoveRow(index)}
                                        >
                                            🗑
                                        </Button>
                                    )}

                                    {index === rows.length - 1 && (
                                        <Button variant="success" onClick={handleAddRow}>
                                            ➕
                                        </Button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}

                    <Button type="submit" className="mt-3">
                        Update
                    </Button>
                </Form>

            </div>
        </div>
    );
}

export default EditCollegeCourse;
