import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from 'react-select';
import { useAddBlog ,useBlogPublish} from "@/hooks/blogHook";
import { z } from "zod";
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import TagInput from '../components/TagInputComponent';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function AddBlog() {
    const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_BROCHURE_SIZE = 5 * 1024 * 1024; // 5MB
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const { mutateAsync: useAddBlogAdd, isPending } = useAddBlog();
    const { mutateAsync: useBlogPublishAdd, isPending:isPendingBlogPublish } = useBlogPublish();

    const [formData, setFormData] = useState({
        title: "",
        heading: "",
        content: "",
        category: "65f1a2b3c4d5e6f7a8b9c0d1",
        excerpt: "",
        seoTitle: "",
        seoDescription: "",
        authorName: "",
        tags: [""],
        blocks: [
            { type: "block", title: "", content: "", order: 1,blockimage:null },
        ],
        coverImage: null,
        authorImage: null,
    });

    const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB");

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTagChange = (index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;

        setFormData({
            ...formData,
            tags: newTags,
        });
    };

    const addTag = () => {
        setFormData({
            ...formData,
            tags: [...formData.tags, ""],
        });
    };

    const handleBlockChange = (index, field, value) => {
  const newBlocks = [...formData.blocks];

  if (field === "type") {
    newBlocks[index] = {
      type: value,
      title: "",
      content: "",
      order: newBlocks[index].order,
      blockimage: null
    };
  } else {
    newBlocks[index][field] = value;
  }

  setFormData({
    ...formData,
    blocks: newBlocks,
  });
};

    const addBlock = () => {
        setFormData({
            ...formData,
            blocks: [
                ...formData.blocks,
                { type: "block", title: "", content: "", order: formData.blocks.length + 1 },
            ],
        });
    };

    const handleFile = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0],
        });
    };

const handleSubmit = async(e) => {
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

  // ✅ If valid → create FormData
  const fd = new FormData();

  fd.append("title", formData.title);
  fd.append("heading", formData.heading);
  fd.append("content", formData.content);
  fd.append("category", formData.category);
  fd.append("excerpt", formData.excerpt);
  fd.append("seoTitle", formData.seoTitle);
  fd.append("seoDescription", formData.seoDescription);
  fd.append("author[name]", formData.authorName);

  formData.tags.forEach(tag => {
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

  if (formData.coverImage) fd.append("coverImage", formData.coverImage);
  if (formData.authorImage) fd.append("authorImage", formData.authorImage);

  setLoading(true);
    await useAddBlogAdd(fd, {

        onSuccess: async(data) => {
            console.log(data, "success")
            if(data.success){
                await useBlogPublishAdd({
                    id:data?.data?._id
                });
                setLoading(false);
                toast.success("Blog Added successfully");

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

    const removeBlock = (index) => {

        const newBlocks = formData.blocks.filter((_, i) => i !== index);

        // ⭐ Recalculate order (VERY IMPORTANT for CMS)
        const updatedBlocks = newBlocks.map((b, i) => ({
            ...b,
            order: i + 1
        }));

        setFormData({
            ...formData,
            blocks: updatedBlocks
        });

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


    return (
        <div>
            <div className="header">
                <h1>Add New Blog</h1>
            </div>

            <div className="content-card">
                {loading && <FullPageLoader />}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={formData.title} name="title" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Heading</Form.Label>
                        <Form.Control value={formData.heading} name="heading" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.content}
                            config={editorConfig}
                            height={"500px"}
                            style={{ width: "100%", height: "500px" }}
                            onChange={(event, editor) => {
                                const data = editor.getData();

                                setFormData({
                                    ...formData,
                                    content: data,
                                })

                            }}
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control name="category" onChange={handleChange} />
        </Form.Group> */}

                    {/* TAGS */}
                    <h5>Tags</h5>
                    <TagInput tags={tags} setTags={setTags} />

                    <hr />

                    {/* BLOCKS */}
                    <h5>Blocks</h5>

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
                                <option value="image">Image</option>
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
                        <Form.Label>Author Name</Form.Label>
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

                    <Button type="submit">Submit</Button>

                </Form>

            </div>
        </div>
    );
}

export default AddBlog;
