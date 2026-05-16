import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from 'react-select';
import { useAddFAQ, useBlogPublish } from "@/hooks/blogHook";
import { file, z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import TagInput from '../components/TagInputComponent';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function AddFaq() {
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    const { mutateAsync: useAddFAQSubmit, isPending: isPendingBlogPublish } = useAddFAQ();

    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "",
    });





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
        await useAddFAQSubmit(data, {

            onSuccess: async (data) => {
                console.log(data, "success")
                if (data.success) {

                    setLoading(false);
                    toast.success("FAQ Added successfully");

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
                <h1>Add New FAQ</h1>
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
                    </Form.Group>

                    <Button type="submit">Submit</Button>

                </Form>

            </div>
        </div>
    );
}

export default AddFaq;
