import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import Select from 'react-select';
import { useGetCityState, useGetStreamAndCourse, useAddCollegeTab ,useGetCollegeTab,useAddCollegeTabEdit} from "@/hooks/collegeHook";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
function EditCollegeTab() {
    const editorConfig = {
        toolbar: {
            items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "horizontalLine",
                "|",
                "alignment",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "highlight",
                "|",
                "codeBlock",
                "sourceEditing",
                "|",
                "undo",
                "redo"
            ],
            shouldNotGroupWhenFull: true,
        },

        codeBlock: {
            languages: [
                { language: "plaintext", label: "Plain text" },
                { language: "html", label: "HTML" },
                { language: "css", label: "CSS" },
                { language: "javascript", label: "JavaScript" },
                { language: "json", label: "JSON" },
            ],
        },

        table: {
            contentToolbar: [
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "tableCellProperties",
                "tableProperties",
            ],
        },

        mediaEmbed: {
            previewsInData: true,
        },
    };
    const { collegeId } = useParams();
    const [loading , setLoading] = useState(false);
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
    const emptyRow = () => ({
        id: Date.now() + Math.random(),
        title: "",
        content: "",
        sequence: "",
        isSaving: false,
        errors: {},
    });
    const [rows, setRows] = useState([emptyRow()]);
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
    const { mutateAsync: useAddCollegeTabAdd, isPending } = useAddCollegeTab(collegeId);
    const { mutateAsync: useAddCollegeTabEditSubmit, isPending: isAddCollegeTabEditPending } = useAddCollegeTabEdit(collegeId);
    const { data: collegeTabData, isFetching: isCollegeTabDataFetching } = useGetCollegeTab(collegeId);


    const updateRow = (id, key, value) => {
        setRows(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };






    const [errors, setErrors] = useState({});






    const addRow = () => {
        setRows(prev => [...prev, emptyRow()]);
    };

    const removeRow = (id) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };
    const validateRow = (row) => {
        const errors = {};
        if (!row.title) errors.title = "Title is required";
        if (!row.content) errors.content = "Content is required";
        if (!row.sequence) errors.sequence = "Sequence is required";
        return errors;
    };

    const handleSave = async (row) => {

        console.log("call")
        const errors = validateRow(row);
        if (Object.keys(errors).length > 0) {
            setRows(prev =>
                prev.map(r =>
                    r.id === row.id ? { ...r, errors } : r
                )
            );
            return;
        }

        const payload = {
            title: row.title,
            content: row.content,
            sequence: Number(row.sequence),
        };
        setLoading(true);
        await useAddCollegeTabAdd(payload, {

            onSuccess: (data) => {
                console.log(data, "success")
                setLoading(false);
                toast.success("College tab added successfully! You can add more tabs or go back to the college list.");
            },
            onError: (error) => {
                setLoading(false);
                toast.error("Failed to add college tab. Please try again.");
                console.log(error, "error")
            }
        })



    }

    const handleSaveUpdate = async (row) => {
        console.log("call2")
        const errors = validateRow(row);
        if (Object.keys(errors).length > 0) {
            setRows(prev =>
                prev.map(r =>
                    r.id === row.id ? { ...r, errors } : r
                )
            );
            return;
        }

        const payload = {
            title: row.title,
            content: row.content,
            sequence: Number(row.sequence),
            tabId: row.id
        };
        console.log(row.id,"row.id")
        setLoading(true);
        await useAddCollegeTabEditSubmit(payload, {

            onSuccess: (data) => {
                console.log(data, "success")
                setLoading(false);
                toast.success("College tab updated successfully");
            },
            onError: (error) => {
                setLoading(false);
                toast.error("Failed to update college tab. Please try again.");
                console.log(error, "error")
            }
        })



    }


    useEffect(() => {
        if (!isCollegeTabDataFetching && collegeTabData) {
            const prefillData = collegeTabData?.data?.map(item => ({
                id: item?._id,
                title: item.title || "",
                content: item.content || "",
                sequence: item.sequence || "",
                errors: {},
            }));
            setRows(prefillData.length > 0 ? prefillData : [emptyRow()]);
        }
    },[collegeTabData, isCollegeTabDataFetching])



    return (
        <div>
            <div className="header">
                <h1>Update and Add New College Content</h1>
            </div>

            <div className="content-card">
                {loading && isCollegeTabDataFetching && <FullPageLoader />}
                <h2>College Content Information</h2>
                {rows.map((row, index) => (
                    <div key={row.id} className="border rounded p-3 mb-3">
                        <div className="row g-3">

                            <div className="col-md-4">
                                <Form.Label>Title <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    value={row.title}
                                    onChange={(e) => updateRow(row.id, "title", e.target.value)}
                                />
                                {row.errors.title && (
                                    <small className="text-danger">{row.errors.title}</small>
                                )}
                            </div>

                            <div className="col-md-4">
                                <Form.Label>Sequence <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={row.sequence}
                                    onChange={(e) => updateRow(row.id, "sequence", e.target.value)}
                                />
                                {row.errors.sequence && (
                                    <small className="text-danger">{row.errors.sequence}</small>
                                )}
                            </div>

                            <div className="col-md-12">
                                <Form.Label>Content <span className='text-danger'>*</span></Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={row.content}
                                    config={editorConfig}
                                    height={"500px"}
                                    style={{ width: "100%", height: "500px" }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        updateRow(row.id, "content", data);
                                    }}
                                />
                                {row.errors.content && (
                                    <small className="text-danger">{row.errors.content}</small>
                                )}
                            </div>
                                {console.log(row?.sequence,"row?.id@@@@")}
                            <div className="col-md-12 d-flex gap-2">
                                <Button
                                    variant="primary"
                                    onClick={() =>  row.id.toString().includes(".") ? handleSave(row) : handleSaveUpdate(row)}
                                    disabled={row.isSaving}
                                >
                                    {row.isSaving ? "Saving..." : "Save"}
                                </Button>

                                {rows.length > 1 && (
                                    <Button
                                        variant="danger"
                                        onClick={() => removeRow(row.id)}
                                    >
                                        Remove
                                    </Button>
                                )}

                                {index === rows.length - 1 && (
                                    <Button variant="success" onClick={addRow}>
                                        ➕ Add
                                    </Button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default EditCollegeTab;
