import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from 'react-select';
import { useAddTestimonial ,useBlogPublish} from "@/hooks/blogHook";
import { file, z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import TagInput from '../components/TagInputComponent';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function AddTestimonials() {
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    
    const { mutateAsync: useAddTestimonialAdd, isPending:isPendingBlogPublish } = useAddTestimonial();

    const [formData, setFormData] = useState({
        name: "",
        message: "",
        image: null,
    });

    



const blogSchema = z.object({
  name: z.string().min(3, "Title required"),
  message: z.string().min(10, "Content required"),
  image: z
              .instanceof(File)
              .refine(
                  (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
                  "Only JPG, JPEG, PNG files are allowed"
              )
              .refine(
                  (file) => file.size <= MAX_LOGO_SIZE,
                  "Logo must be less than 2MB"
              ),
             
  
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
  const fd = new FormData();

  fd.append("name", formData.name);
  fd.append("message", formData.message);
//   fd.append("category", formData.category);
  fd.append("image", formData.image);
  

  setLoading(true);
    await useAddTestimonialAdd(fd, {

        onSuccess: async(data) => {
            console.log(data, "success")
            if(data.success){
                
                setLoading(false);
                toast.success("Testimonial Added successfully");

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
                <h1>Add New Testimonial</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Image <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={formData.name} name="name" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Message <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={5} value={formData.message} name="message" onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                    </Form.Group>

                    

                    <Button type="submit">Submit</Button>

                </Form>

            </div>
        </div>
    );
}

export default AddTestimonials;
