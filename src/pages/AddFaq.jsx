import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from 'react-select';
import { useAddFAQ ,useBlogPublish} from "@/hooks/blogHook";
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
    
    const { mutateAsync: useAddFAQSubmit, isPending:isPendingBlogPublish } = useAddFAQ();

    const [formData, setFormData] = useState({
        question: "",
        answer: "",
    });

    



const blogSchema = z.object({
  question: z.string().min(1, "Question required"),
  answer: z.string().min(1, "Answer required"),
});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };





const handleSubmit = async(e) => {
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
  }
  

  setLoading(true);
    await useAddFAQSubmit(data, {

        onSuccess: async(data) => {
            console.log(data, "success")
            if(data.success){
                
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




    return (
        <div>
            <div className="header">
                <h1>Add New FAQ</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Question <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={3} value={formData.question} name="question" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Answer <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={5} value={formData.answer} name="answer" onChange={handleChange} />
                    </Form.Group>

                    <Button type="submit">Submit</Button>

                </Form>

            </div>
        </div>
    );
}

export default AddFaq;
