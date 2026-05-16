import React, { useState, useCallback, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from 'react-select';
import { useUpdateFAQ, useGetFAQDetails } from "@/hooks/blogHook";
import { file, z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import TagInput from '../components/TagInputComponent';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, useParams } from "react-router-dom";
function EditFaq() {
    const { id } = useParams();
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    const { mutateAsync: updateFAQ, isPending: isPendingBlogPublish } = useUpdateFAQ(id);
    const { data: useGetFAQDetailsData, isFetching } = useGetFAQDetails(id);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "",
    });

    useEffect(() => {
        if (useGetFAQDetailsData?.success && !isFetching) {
            const details = useGetFAQDetailsData?.data;
            console.log(details, "details")
            setFormData({
                question: details.question,
                answer: details.answer,
                category: details.category || "",
            });
        }

    }, [useGetFAQDetailsData, isFetching])



    const blogSchema = z.object({
        question: z.string().min(1, "Question required"),
        answer: z.string().min(1, "Answer required"),
        category: z.string().min(1, "Category required"),
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };





    const handleSubmit = async (e) => {
        e.preventDefault();



        const result = blogSchema.safeParse(formData);

        if (!result.success) {

            result.error.issues.forEach(err => {
                toast.error(err.message);
            });

            return;
        }

        // ✅ If valid → create FormData
        let data = {
            answer: formData.answer,
            question: formData.question,
            category: formData.category,
        }


        setLoading(true);
        await updateFAQ(data, {

            onSuccess: async (data) => {
                console.log(data, "success")
                if (data.success) {

                    setLoading(false);
                    toast.success("FAQ Updated successfully");

                }
            },
            onError: (error) => {
                setLoading(false);
                toast.error("Failed to add. Please try again.");
                console.log(error, "error")
            }
        })



        // API CALL
    };




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
                "tableCellProperties",
                "tableProperties",
            ],
        },
        mediaEmbed: {
            previewsInData: true,
        },
    };

    return (
        <div>
            <div className="header">
                <h1>Edit FAQ</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="home">Home</option>
                            <option value="aboutus">About us</option>
                            <option value="referandearn">Refer and Earn</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Question <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={3} value={formData.question} name="question" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Answer <span className="text-danger">*</span></Form.Label>
                        {!isFetching ? (
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.answer}
                                config={editorConfig}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFormData(prev => ({
                                        ...prev,
                                        answer: data,
                                    }));
                                }}
                            />
                        ) : (
                            <div className="text-muted">Loading editor...</div>
                        )}
                    </Form.Group>

                    <Button type="submit">Submit</Button>

                </Form>

            </div>
        </div>
    );
}

export default EditFaq;
