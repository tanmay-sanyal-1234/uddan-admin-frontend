import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import { z } from "zod";
import TagInput from '../components/TagInputComponent';
import {
  useGetBlogDetails,
  useUpdateBlog,
} from "@/hooks/blogHook";

import FullPageLoader from "@/components/FullPageLoader";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading,isFetching } = useGetBlogDetails(id);
  const { mutateAsync: updateBlog } = useUpdateBlog(id);
    const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    content: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
    authorName: "",
    tags: [],
    blocks: [],
    coverImage: null,
    authorImage: null,
  });

  // ✅ Prefill Data
  useEffect(() => {
    if (data && !isFetching) {
        console.log("object")
      const blog = data.data;
        console.log(blog)
      setFormData({
        title: blog?.title || "",
        heading: blog?.heading || "",
        content: blog?.content || "",
        excerpt: blog?.excerpt || "",
        seoTitle: blog?.seoTitle || "",
        seoDescription: blog?.seoDescription || "",
        authorName: blog?.author?.name || "",
        tags: blog?.tags || [],
        blocks: blog?.blocks || [],
        coverImage: null,
        authorImage: null,
      });
    }
  }, [data,isFetching]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index][field] = value;

    setFormData({ ...formData, blocks: newBlocks });
  };

  const addBlock = () => {
    setFormData({
      ...formData,
      blocks: [
        ...formData.blocks,
        {
          type: "block",
          title: "",
          content: "",
          order: formData.blocks.length + 1,
        },
      ],
    });
  };

  const removeBlock = (index) => {
    const newBlocks = formData.blocks
      .filter((_, i) => i !== index)
      .map((b, i) => ({ ...b, order: i + 1 }));

    setFormData({ ...formData, blocks: newBlocks });
  };

  const handleFile = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const blockSchema = z.object({
    type: z.enum(["block", "image"]),
    title: z.string().optional(),
    content: z.string().optional(),
    order: z.number(),
    blockimage: z.any().optional(),
  })
  .refine(data => data.type !== "block" || (data.title && data.title.trim() !== ""), {
    message: "Block title required",
    path: ["title"]
  })
  .refine(data => data.type !== "block" || (data.content && data.content.trim() !== ""), {
    message: "Block content required",
    path: ["content"]
  })
  .refine(data => data.type !== "image" || data.blockimage, {
    message: "Block image required",
    path: ["blockimage"]
  });
  
  const blogSchema = z.object({
    title: z.string().min(3, "Title required"),
    heading: z.string().min(3, "Heading required"),
    content: z.string().min(10, "Content required"),
  
    excerpt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  
    authorName: z.string().min(2, "Author name required"),
  
    coverImage: z.any().optional(),
    authorImage: z.any().optional(),
  
    tags: z.array(z.string()).min(1, "At least one tag required"),
  
    blocks: z.array(blockSchema).min(1, "At least one block required"),
  });

  // ✅ Submit (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

     const validationData = {
        ...formData,
        blocks: formData.blocks.map(b => ({
          ...b,
          order: Number(b.order)
        }))
      };
    
      const result = blogSchema.safeParse(validationData);
    
      if (!result.success) {
    
        result.error.issues.forEach(err => {
        toast.error(err.message);
        });
    
        return;
      }

    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("heading", formData.heading);
    fd.append("content", formData.content);
    fd.append("excerpt", formData.excerpt);
    fd.append("seoTitle", formData.seoTitle);
    fd.append("seoDescription", formData.seoDescription);
    fd.append("author[name]", formData.authorName);


    formData.tags.forEach((tag) => {
      fd.append("tags[]", tag);
    });

    formData.blocks.forEach((block, i) => {
      fd.append(`blocks[${i}][type]`, block.type);
      fd.append(`blocks[${i}][title]`, block.title);
      fd.append(`blocks[${i}][content]`, block.content);
      fd.append(`blocks[${i}][order]`, block.order);

      if (block.blockimage) {
        fd.append(`blocks[${i}][blockimage]`, block.blockimage);
      }
    });

    if (formData.coverImage)
      fd.append("coverImage", formData.coverImage);

    if (formData.authorImage)
      fd.append("authorImage", formData.authorImage);

    try {
      setLoading(true);

      await updateBlog(fd ,
        {
          onSuccess: () => {
            toast.success("Blog updated successfully");
            navigate("/blogs");
          },
          onError: () => {
            toast.error("Update failed");
          },
        }
      );
    } finally {
      setLoading(false);
    }
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
                "tableProperties",
            ],
        },

        mediaEmbed: {
            previewsInData: true,
        },
    };


  if (isFetching) return <FullPageLoader />;

  return (
    <div>
     <div className="header">
                <h1>Edit Blog</h1>
            </div>
    <div className="content-card">
      {loading && <FullPageLoader />}
        {console.log(formData,"fff")}
      <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={formData.title} name="title" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Heading <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={formData.heading} name="heading" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Content <span className="text-danger">*</span></Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.content}
                            config={editorConfig}
                            height={"500px"}
                            style={{ width: "100%", height: "500px" }}
                            onChange={(event, editor) => {
                                const data = editor.getData();

                                setFormData((prev) => ({ ...prev, content: data }));

                            }}
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control name="category" onChange={handleChange} />
        </Form.Group> */}

                    {/* TAGS */}
                    {/* <h5>Tags</h5>
                    <TagInput tags={tags} setTags={setTags} />

                    <hr /> */}

                    {/* BLOCKS */}
                    <h5>Blocks <span className="text-danger">*</span></h5>

                    {formData.blocks.map((block, i) => (
                        <Card key={i} className="p-3 mb-3">

                            <div className="d-flex justify-content-end mb-2">
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeBlock(i)}
                                >
                                    Remove
                                </button>
                            </div>
                            <select
                                name="type"
                                className="form-control mb-2"
                                value={block.type}
                                onChange={(e) =>
                                    handleBlockChange(i, "type", e.target.value)
                                }
                            >
                                <option value="block">Block</option>
                                
                            </select>
                            <Form.Control
                                placeholder="Order"
                                className='mb-2'
                                type="number"
                                value={block.order}
                                onChange={(e) => handleBlockChange(i, "order", e.target.value)}
                            />

                            {/* ✅ CONDITION */}
                            {block.type === "block" && (
                                <>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Title"
                                        value={block.title || ""}
                                        onChange={(e) =>
                                            handleBlockChange(i, "title", e.target.value)
                                        }
                                    />

                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={block.content || ""}
                                        config={editorConfig}
                                        height={"500px"}
                                        style={{ width: "100%", height: "500px" }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleBlockChange(i, "content", data)

                                        }}
                                    />


                                </>
                            )}

                            {block.type === "image" && (
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) =>
                                        handleBlockChange(i, "blockimage", e.target.files[0])
                                    }
                                />
                            )}

                        </Card>
                    ))}

                    <Button variant="info" onClick={addBlock}>Add Block</Button>

                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Author Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={formData.authorName} name="authorName" onChange={handleChange} />
                    </Form.Group>
                    {/* FILES */}
                    <Form.Group className="mb-3">
                        <Form.Label>Author Image</Form.Label>
                        <Form.Control type="file" name="authorImage" onChange={handleFile} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control type="file" name="coverImage" onChange={handleFile} />
                    </Form.Group>

                    <Button type="submit">Update</Button>

                </Form>
                </div>
    </div>
  );
}

export default EditBlog;