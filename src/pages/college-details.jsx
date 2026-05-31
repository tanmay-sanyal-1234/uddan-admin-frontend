import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FullPageLoader from "@/components/FullPageLoader";
import { useAddCollegeDetails, useGetCollegeDetails } from "@/hooks/collegeHook";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { z } from 'zod';

const CollegeDetails = () => {
    const styles = `
        .ck-error .ck-editor__main > .ck-editor__editable {
            border-color: #dc3545 !important;
        }
        .ck-error .ck-toolbar {
            border-color: #dc3545 !important;
        }
    `;
    const { collegeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { data: existingDetails, isLoading: isDetailsLoading } = useGetCollegeDetails(collegeId);
    const { mutateAsync: addDetails } = useAddCollegeDetails(collegeId);
    const [errors, setErrors] = useState({});

    const collegeDetailsSchema = z.object({
        realityScore: z.array(z.object({
            label: z.string().min(1, "Label is required"),
            score: z.number().min(0).max(10),
            color: z.string().min(4, "Color is required")
        })).optional(),
        expectationGaps: z.array(z.object({
            title: z.string().min(3, "Title must be at least 3 characters"),
            description: z.string().min(10, "Description must be at least 10 characters")
        })).optional(),
        expectationVsReality: z.array(z.object({
            category: z.string().min(2, "Category is required"),
            expectation: z.array(z.string().min(1, "Expectation cannot be empty")),
            reality: z.array(z.string().min(1, "Reality cannot be empty"))
        })).optional(),
        redFlags: z.array(z.object({
            title: z.string().min(3, "Title required"),
            description: z.string().min(10, "Description required")
        })).optional(),
        placementBreakdown: z.object({
            top: z.object({ range: z.string().min(1, "Range required"), description: z.string().min(5, "Description required") }),
            avg: z.object({ range: z.string().min(1, "Range required"), description: z.string().min(5, "Description required") }),
            low: z.object({ range: z.string().min(1, "Range required"), description: z.string().min(5, "Description required") }),
            description: z.string().min(10, "Overall description required"),
            recruiters: z.array(z.string().min(1, "Recruiter name required"))
        }),
        admissionReality: z.object({
            isPartner: z.boolean(),
            title: z.string().optional(),
            description: z.string().optional(),
            pills: z.array(z.string()).optional(),
            process: z.array(z.object({
                title: z.string().optional(),
                description: z.string().optional()
            })).optional(),
            advantage: z.string().optional()
        }).optional(),
        academicPressure: z.object({
            ratings: z.array(z.object({
                label: z.string().min(1, "Label required"),
                score: z.number().min(0).max(10),
                color: z.string().min(4, "Color required")
            })),
            description: z.string().min(10, "Description required")
        }),
        scholarships: z.array(z.object({
            title: z.string().min(3, "Title required"),
            benefit: z.string().min(1, "Benefit required")
        })).optional(),
        hostelExperience: z.object({
            good: z.string().min(10, "Description required"),
            reality: z.string().min(10, "Description required"),
            alternative: z.string().min(10, "Description required"),
            sentiment: z.string().min(2, "Sentiment required")
        }),
        studentVoices: z.array(z.object({
            quote: z.string().min(10, "Quote required"),
            name: z.string().min(2, "Name required"),
            details: z.string().min(2, "Details required"),
            initials: z.string().min(1, "Initials required"),
            color: z.string().min(4, "Color required")
        })).optional(),
        verdict: z.object({
            goForIt: z.array(z.string().min(1, "Point required")),
            thinkCarefully: z.array(z.string().min(1, "Point required")),
            reconsider: z.array(z.string().min(1, "Point required")),
            disclaimer: z.string().min(10, "Disclaimer required")
        })
    });

    const [form, setForm] = useState({
        realityScore: [],
        expectationGaps: [],
        expectationVsReality: [],
        redFlags: [],
        placementBreakdown: {
            top: { range: "", description: "" },
            avg: { range: "", description: "" },
            low: { range: "", description: "" },
            description: "",
            recruiters: []
        },
        admissionReality: {
            isPartner: false,
            title: "",
            description: "",
            pills: [],
            process: [],
            advantage: ""
        },
        academicPressure: {
            ratings: [],
            description: ""
        },
        scholarships: [],
        hostelExperience: {
            good: "",
            reality: "",
            alternative: "",
            sentiment: ""
        },
        studentVoices: [],
        verdict: {
            goForIt: [],
            thinkCarefully: [],
            reconsider: [],
            disclaimer: ""
        }
    });

    const initialized = useRef(false);

    useEffect(() => {
        const section = existingDetails?.data?.section;

        if (!section || initialized.current) return;

        initialized.current = true;

        setForm(prev => ({
            ...prev,
            ...section,
            placementBreakdown: {
                ...prev.placementBreakdown,
                ...(section.placementBreakdown || {})
            },
            admissionReality: {
                ...prev.admissionReality,
                ...(section.admissionReality || {})
            },
            verdict: {
                ...prev.verdict,
                ...(section.verdict || {})
            }
        }));
    }, [existingDetails]);


    const handleChange = (section, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedChange = (section, subsection, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    const addItem = (section, template) => {
        setForm(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const removeItem = (section, index) => {
        setForm(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateItem = (section, index, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
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

    const handleSaveSection = async (sectionName) => {
        // Create a specific schema for this section
        // We can't easily use .pick() on a complex object with optional sections if not careful,
        // so we'll just validate the whole form but only check for errors in this section's path.
        const result = collegeDetailsSchema.safeParse(form);

        if (!result.success) {
            const sectionErrors = result.error.issues.filter(issue => issue.path[0] === sectionName);

            if (sectionErrors.length > 0) {
                const formattedErrors = {};
                sectionErrors.forEach((issue) => {
                    const path = issue.path.join('.');
                    formattedErrors[path] = issue.message;
                });
                setErrors(prev => ({ ...prev, ...formattedErrors }));
                toast.error(`Please fix validation errors in the ${sectionName} section.`);
                return;
            }
        }

        // Clear previous errors for this section
        setErrors(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                if (key.startsWith(sectionName)) delete next[key];
            });
            return next;
        });

        setLoading(true);
        try {
            // Only send the specific section object as requested
            await addDetails({ [sectionName]: form[sectionName] });
            toast.success(`${sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated successfully!`);
        } catch (error) {
            toast.error("Failed to update section.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = collegeDetailsSchema.safeParse(form);
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                formattedErrors[path] = issue.message;
            });
            setErrors(formattedErrors);
            toast.error("Please fix the validation errors in the form.");
            console.log(formattedErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await addDetails(form);
            toast.success("All college details updated successfully!");
        } catch (error) {
            toast.error("Failed to update college details.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (isDetailsLoading) return <FullPageLoader />;

    return (
        <div className="college-editorial-page">
            <style>{styles}</style>
            <div className="header d-flex justify-content-between align-items-center mb-4">
                <h1>College Editorial Details</h1>
                <Button variant="outline-primary" onClick={() => navigate('/college')}>Back to List</Button>
            </div>

            <Form onSubmit={handleSubmit}>
                {/* Reality Score Section */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Reality Score</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('realityScore', { label: "", score: 0, color: "#000000" })}>
                                Add Score Item
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('realityScore')}>
                                Save Reality Score
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.realityScore.map((item, index) => (
                            <Row key={index} className="mb-3 align-items-end border-bottom pb-3">
                                <Col md={4}>
                                    <Form.Label>Label</Form.Label>
                                    <Form.Control
                                        value={item.label}
                                        onChange={(e) => updateItem('realityScore', index, 'label', e.target.value)}
                                        placeholder="e.g. PLACEMENTS"
                                        isInvalid={!!errors[`realityScore.${index}.label`]}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label>Score (0-10)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        value={item.score}
                                        onChange={(e) => updateItem('realityScore', index, 'score', parseFloat(e.target.value))}
                                        isInvalid={!!errors[`realityScore.${index}.score`]}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="color"
                                        value={item.color}
                                        onChange={(e) => updateItem('realityScore', index, 'color', e.target.value)}
                                        isInvalid={!!errors[`realityScore.${index}.color`]}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" size="sm" onClick={() => removeItem('realityScore', index)}>Remove</Button>
                                </Col>
                            </Row>
                        ))}
                    </Card.Body>
                </Card>

                {/* Expectation Gaps */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Expectation Gaps</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('expectationGaps', { title: "", description: "" })}>
                                Add Gap Item
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('expectationGaps')}>
                                Save Gaps
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.expectationGaps.map((item, index) => (
                            <div key={index} className="mb-3 border-bottom pb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        value={item.title}
                                        onChange={(e) => updateItem('expectationGaps', index, 'title', e.target.value)}
                                        isInvalid={!!errors[`expectationGaps.${index}.title`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`expectationGaps.${index}.title`]}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <div className={!!errors[`expectationGaps.${index}.description`] ? 'is-invalid ck-error' : ''}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={item.description}
                                            config={editorConfig}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                updateItem('expectationGaps', index, 'description', data);
                                            }}
                                        />
                                    </div>
                                    {errors[`expectationGaps.${index}.description`] && <small className="text-danger">{errors[`expectationGaps.${index}.description`]}</small>}
                                </Form.Group>
                                <Button variant="danger" size="sm" onClick={() => removeItem('expectationGaps', index)}>Remove</Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>

                {/* Expectation vs Reality */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Expectation vs Reality</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('expectationVsReality', { category: "", expectation: [], reality: [] })}>
                                Add Category
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('expectationVsReality')}>
                                Save Comparison
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.expectationVsReality.map((item, index) => (
                            <div key={index} className="mb-4 p-3 border rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>Category Name</Form.Label>
                                    <Form.Control
                                        value={item.category}
                                        onChange={(e) => updateItem('expectationVsReality', index, 'category', e.target.value)}
                                        placeholder="e.g. PLACEMENT"
                                        isInvalid={!!errors[`expectationVsReality.${index}.category`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`expectationVsReality.${index}.category`]}</Form.Control.Feedback>
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6>Expectations</h6>
                                            <Button size="sm" variant="outline-success" onClick={() => {
                                                const newExpectation = [...item.expectation, ""];
                                                updateItem('expectationVsReality', index, 'expectation', newExpectation);
                                            }}>+</Button>
                                        </div>
                                        {item.expectation.map((exp, i) => (
                                            <div key={i} className="mb-2">
                                                <div className="d-flex">
                                                    <Form.Control
                                                        size="sm"
                                                        value={exp}
                                                        onChange={(e) => {
                                                            const newExpectation = [...item.expectation];
                                                            newExpectation[i] = e.target.value;
                                                            updateItem('expectationVsReality', index, 'expectation', newExpectation);
                                                        }}
                                                        isInvalid={!!errors[`expectationVsReality.${index}.expectation.${i}`]}
                                                    />
                                                    <Button size="sm" variant="link" className="text-danger" onClick={() => {
                                                        const newExpectation = item.expectation.filter((_, idx) => idx !== i);
                                                        updateItem('expectationVsReality', index, 'expectation', newExpectation);
                                                    }}>×</Button>
                                                </div>
                                                {errors[`expectationVsReality.${index}.expectation.${i}`] && <small className="text-danger">{errors[`expectationVsReality.${index}.expectation.${i}`]}</small>}
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6>Reality</h6>
                                            <Button size="sm" variant="outline-success" onClick={() => {
                                                const newReality = [...item.reality, ""];
                                                updateItem('expectationVsReality', index, 'reality', newReality);
                                            }}>+</Button>
                                        </div>
                                        {item.reality.map((real, i) => (
                                            <div key={i} className="mb-2">
                                                <div className="d-flex">
                                                    <Form.Control
                                                        size="sm"
                                                        value={real}
                                                        onChange={(e) => {
                                                            const newReality = [...item.reality];
                                                            newReality[i] = e.target.value;
                                                            updateItem('expectationVsReality', index, 'reality', newReality);
                                                        }}
                                                        isInvalid={!!errors[`expectationVsReality.${index}.reality.${i}`]}
                                                    />
                                                    <Button size="sm" variant="link" className="text-danger" onClick={() => {
                                                        const newReality = item.reality.filter((_, idx) => idx !== i);
                                                        updateItem('expectationVsReality', index, 'reality', newReality);
                                                    }}>×</Button>
                                                </div>
                                                {errors[`expectationVsReality.${index}.reality.${i}`] && <small className="text-danger">{errors[`expectationVsReality.${index}.reality.${i}`]}</small>}
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                                <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => removeItem('expectationVsReality', index)}>Remove Category</Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>

                {/* Red Flags */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Red Flags</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('redFlags', { title: "", description: "" })}>
                                Add Red Flag
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('redFlags')}>
                                Save Red Flags
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.redFlags.map((item, index) => (
                            <div key={index} className="mb-3 border-bottom pb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        value={item.title}
                                        onChange={(e) => updateItem('redFlags', index, 'title', e.target.value)}
                                        isInvalid={!!errors[`redFlags.${index}.title`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`redFlags.${index}.title`]}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <div className={!!errors[`redFlags.${index}.description`] ? 'is-invalid ck-error' : ''}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={item.description}
                                            config={editorConfig}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                updateItem('redFlags', index, 'description', data);
                                            }}
                                        />
                                    </div>
                                    {errors[`redFlags.${index}.description`] && <small className="text-danger">{errors[`redFlags.${index}.description`]}</small>}
                                </Form.Group>
                                <Button variant="danger" size="sm" onClick={() => removeItem('redFlags', index)}>Remove</Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>

                {/* Placement Breakdown */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Placement Breakdown</h5>
                        <Button variant="success" size="sm" onClick={() => handleSaveSection('placementBreakdown')}>
                            Save Placement Data
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {['top', 'avg', 'low'].map(tier => (
                                <Col md={4} key={tier} className="mb-3">
                                    <h6>{tier.toUpperCase()} Tier</h6>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Range</Form.Label>
                                        <Form.Control
                                            value={form.placementBreakdown[tier].range}
                                            onChange={(e) => handleNestedChange('placementBreakdown', tier, 'range', e.target.value)}
                                            placeholder="e.g. ₹12–18 LPA"
                                            isInvalid={!!errors[`placementBreakdown.${tier}.range`]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors[`placementBreakdown.${tier}.range`]}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Description</Form.Label>
                                        <div className={!!errors[`placementBreakdown.${tier}.description`] ? 'is-invalid ck-error' : ''}>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={form.placementBreakdown[tier].description}
                                                config={editorConfig}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    handleNestedChange('placementBreakdown', tier, 'description', data);
                                                }}
                                            />
                                        </div>
                                        {errors[`placementBreakdown.${tier}.description`] && <small className="text-danger">{errors[`placementBreakdown.${tier}.description`]}</small>}
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Overall Placement Description</Form.Label>
                            <div className={!!errors[`placementBreakdown.description`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.placementBreakdown.description || ""}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('placementBreakdown', 'description', data);
                                    }}
                                />
                            </div>
                            {errors[`placementBreakdown.description`] && <small className="text-danger">{errors[`placementBreakdown.description`]}</small>}
                        </Form.Group>
                        <hr />
                        <Form.Group>
                            <Form.Label>Recruiters (comma separated)</Form.Label>
                            <Form.Control
                                value={form.placementBreakdown.recruiters.join(", ")}
                                onChange={(e) => handleChange('placementBreakdown', 'recruiters', e.target.value.split(",").map(s => s.trim()))}
                                placeholder="Deloitte, KPMG, Accenture..."
                                isInvalid={!!errors[`placementBreakdown.recruiters`]}
                            />
                            <Form.Control.Feedback type="invalid">{errors[`placementBreakdown.recruiters`]}</Form.Control.Feedback>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Admission Reality */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Admission Reality</h5>
                        <Button variant="success" size="sm" onClick={() => handleSaveSection('admissionReality')}>
                            Save Admission Data
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Form.Check
                            type="switch"
                            id="isPartner"
                            label="Is Partner College?"
                            checked={form.admissionReality.isPartner}
                            onChange={(e) => handleChange('admissionReality', 'isPartner', e.target.checked)}
                            className="mb-3"
                        />
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={form.admissionReality.title}
                                onChange={(e) => handleChange('admissionReality', 'title', e.target.value)}
                                isInvalid={!!errors[`admissionReality.title`]}
                            />
                            <Form.Control.Feedback type="invalid">{errors[`admissionReality.title`]}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <div className={!!errors[`admissionReality.description`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.admissionReality.description || ""}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('admissionReality', 'description', data);
                                    }}
                                />
                            </div>
                            {errors[`admissionReality.description`] && <small className="text-danger">{errors[`admissionReality.description`]}</small>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pills (comma separated)</Form.Label>
                            <Form.Control
                                value={form.admissionReality.pills.join(", ")}
                                onChange={(e) => handleChange('admissionReality', 'pills', e.target.value.split(",").map(s => s.trim()))}
                                isInvalid={!!errors[`admissionReality.pills`]}
                            />
                            <Form.Control.Feedback type="invalid">{errors[`admissionReality.pills`]}</Form.Control.Feedback>
                        </Form.Group>

                        <h6>Admission Process Steps</h6>
                        {form.admissionReality.process.map((step, index) => (
                            <div key={index} className="mb-3 border rounded p-2">
                                <Form.Group className="mb-2">
                                    <Form.Label>Step Title</Form.Label>
                                    <Form.Control
                                        value={step.title}
                                        onChange={(e) => {
                                            const newProcess = [...form.admissionReality.process];
                                            newProcess[index] = { ...step, title: e.target.value };
                                            handleChange('admissionReality', 'process', newProcess);
                                        }}
                                        isInvalid={!!errors[`admissionReality.process.${index}.title`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`admissionReality.process.${index}.title`]}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Step Description</Form.Label>
                                    <div className={!!errors[`admissionReality.process.${index}.description`] ? 'is-invalid ck-error' : ''}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={step.description || ""}
                                            config={editorConfig}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                const newProcess = [...form.admissionReality.process];
                                                newProcess[index] = { ...step, description: data };
                                                handleChange('admissionReality', 'process', newProcess);
                                            }}
                                        />
                                    </div>
                                    {errors[`admissionReality.process.${index}.description`] && <small className="text-danger">{errors[`admissionReality.process.${index}.description`]}</small>}
                                </Form.Group>
                                <Button variant="link" className="text-danger p-0" onClick={() => {
                                    const newProcess = form.admissionReality.process.filter((_, i) => i !== index);
                                    handleChange('admissionReality', 'process', newProcess);
                                }}>Remove Step</Button>
                            </div>
                        ))}
                        <Button variant="outline-success" size="sm" onClick={() => {
                            const newProcess = [...form.admissionReality.process, { title: "", description: "" }];
                            handleChange('admissionReality', 'process', newProcess);
                        }}>Add Process Step</Button>

                        <Form.Group className="mt-3">
                            <Form.Label>Advertisements Text</Form.Label>
                            <div className={!!errors[`admissionReality.advantage`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.admissionReality.advantage || ""}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('admissionReality', 'advantage', data);
                                    }}
                                />
                            </div>
                            {errors[`admissionReality.advantage`] && <small className="text-danger">{errors[`admissionReality.advantage`]}</small>}
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Academic Pressure */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Academic Pressure</h5>
                        <Button variant="success" size="sm" onClick={() => handleSaveSection('academicPressure')}>
                            Save Pressure Data
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <h6>Ratings</h6>
                        {form.academicPressure.ratings.map((rating, index) => (
                            <Row key={index} className="mb-3 align-items-end">
                                <Col md={4}>
                                    <Form.Label>Label</Form.Label>
                                    <Form.Control
                                        value={rating.label}
                                        onChange={(e) => {
                                            const newRatings = [...form.academicPressure.ratings];
                                            newRatings[index] = { ...rating, label: e.target.value };
                                            handleChange('academicPressure', 'ratings', newRatings);
                                        }}
                                        isInvalid={!!errors[`academicPressure.ratings.${index}.label`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`academicPressure.ratings.${index}.label`]}</Form.Control.Feedback>
                                </Col>
                                <Col md={3}>
                                    <Form.Label>Score</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        value={rating.score}
                                        onChange={(e) => {
                                            const newRatings = [...form.academicPressure.ratings];
                                            newRatings[index] = { ...rating, score: parseFloat(e.target.value) };
                                            handleChange('academicPressure', 'ratings', newRatings);
                                        }}
                                        isInvalid={!!errors[`academicPressure.ratings.${index}.score`]}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="color"
                                        value={rating.color}
                                        onChange={(e) => {
                                            const newRatings = [...form.academicPressure.ratings];
                                            newRatings[index] = { ...rating, color: e.target.value };
                                            handleChange('academicPressure', 'ratings', newRatings);
                                        }}
                                        isInvalid={!!errors[`academicPressure.ratings.${index}.color`]}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" size="sm" onClick={() => {
                                        const newRatings = form.academicPressure.ratings.filter((_, i) => i !== index);
                                        handleChange('academicPressure', 'ratings', newRatings);
                                    }}>Remove</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-success" size="sm" className="mb-3" onClick={() => {
                            const newRatings = [...form.academicPressure.ratings, { label: "", score: 0, color: "#000000" }];
                            handleChange('academicPressure', 'ratings', newRatings);
                        }}>Add Rating</Button>

                        <Form.Group>
                            <Form.Label>Overall Academic Description</Form.Label>
                            <div className={!!errors[`academicPressure.description`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.academicPressure.description}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('academicPressure', 'description', data);
                                    }}
                                />
                            </div>
                            {errors[`academicPressure.description`] && <small className="text-danger">{errors[`academicPressure.description`]}</small>}
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Scholarships */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Scholarships</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('scholarships', { title: "", benefit: "" })}>
                                Add Scholarship
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('scholarships')}>
                                Save Scholarships
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.scholarships.map((item, index) => (
                            <Row key={index} className="mb-3 border-bottom pb-3 align-items-end">
                                <Col md={5}>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        value={item.title}
                                        onChange={(e) => updateItem('scholarships', index, 'title', e.target.value)}
                                        isInvalid={!!errors[`scholarships.${index}.title`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`scholarships.${index}.title`]}</Form.Control.Feedback>
                                </Col>
                                <Col md={5}>
                                    <Form.Label>Benefit</Form.Label>
                                    <Form.Control
                                        value={item.benefit}
                                        onChange={(e) => updateItem('scholarships', index, 'benefit', e.target.value)}
                                        isInvalid={!!errors[`scholarships.${index}.benefit`]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[`scholarships.${index}.benefit`]}</Form.Control.Feedback>
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" size="sm" onClick={() => removeItem('scholarships', index)}>Remove</Button>
                                </Col>
                            </Row>
                        ))}
                    </Card.Body>
                </Card>

                {/* Hostel Experience */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Hostel Experience</h5>
                        <Button variant="success" size="sm" onClick={() => handleSaveSection('hostelExperience')}>
                            Save Hostel Data
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>The Good</Form.Label>
                            <div className={!!errors[`hostelExperience.good`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.hostelExperience.good}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('hostelExperience', 'good', data);
                                    }}
                                />
                            </div>
                            {errors[`hostelExperience.good`] && <small className="text-danger">{errors[`hostelExperience.good`]}</small>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>The Reality</Form.Label>
                            <div className={!!errors[`hostelExperience.reality`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.hostelExperience.reality}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('hostelExperience', 'reality', data);
                                    }}
                                />
                            </div>
                            {errors[`hostelExperience.reality`] && <small className="text-danger">{errors[`hostelExperience.reality`]}</small>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Alternative</Form.Label>
                            <div className={!!errors[`hostelExperience.alternative`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.hostelExperience.alternative}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('hostelExperience', 'alternative', data);
                                    }}
                                />
                            </div>
                            {errors[`hostelExperience.alternative`] && <small className="text-danger">{errors[`hostelExperience.alternative`]}</small>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sentiment</Form.Label>
                            <div className={!!errors[`hostelExperience.sentiment`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.hostelExperience.sentiment}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleChange('hostelExperience', 'sentiment', data);
                                    }}
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors[`hostelExperience.sentiment`]}</Form.Control.Feedback>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Student Voices */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Student Voices</h5>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => addItem('studentVoices', { quote: "", name: "", details: "", initials: "", color: "#000000" })}>
                                Add Student Voice
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleSaveSection('studentVoices')}>
                                Save Voices
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {form.studentVoices.map((item, index) => (
                            <div key={index} className="mb-4 p-3 border rounded">
                                <Form.Group className="mb-2">
                                    <Form.Label>Quote</Form.Label>
                                    <div className={!!errors[`studentVoices.${index}.quote`] ? 'is-invalid ck-error' : ''}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={item.quote}
                                            config={editorConfig}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                updateItem('studentVoices', index, 'quote', data);
                                            }}
                                        />
                                    </div>
                                    {errors[`studentVoices.${index}.quote`] && <small className="text-danger">{errors[`studentVoices.${index}.quote`]}</small>}
                                </Form.Group>
                                <Row>
                                    <Col md={4}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            value={item.name}
                                            onChange={(e) => updateItem('studentVoices', index, 'name', e.target.value)}
                                            isInvalid={!!errors[`studentVoices.${index}.name`]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors[`studentVoices.${index}.name`]}</Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Details (e.g. BBA Graduate, 2024)</Form.Label>
                                        <Form.Control
                                            value={item.details}
                                            onChange={(e) => updateItem('studentVoices', index, 'details', e.target.value)}
                                            isInvalid={!!errors[`studentVoices.${index}.details`]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors[`studentVoices.${index}.details`]}</Form.Control.Feedback>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Short name (eg : AR)</Form.Label>
                                        <Form.Control
                                            value={item.initials}
                                            onChange={(e) => updateItem('studentVoices', index, 'initials', e.target.value)}
                                            isInvalid={!!errors[`studentVoices.${index}.initials`]}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors[`studentVoices.${index}.initials`]}</Form.Control.Feedback>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Color</Form.Label>
                                        <Form.Control
                                            type="color"
                                            value={item.color}
                                            onChange={(e) => updateItem('studentVoices', index, 'color', e.target.value)}
                                            isInvalid={!!errors[`studentVoices.${index}.color`]}
                                        />
                                    </Col>
                                </Row>
                                <Button variant="danger" size="sm" className="mt-2" onClick={() => removeItem('studentVoices', index)}>Remove</Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>

                {/* Verdict */}
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Verdict</h5>
                        <Button variant="success" size="sm" onClick={() => handleSaveSection('verdict')}>
                            Save Verdict
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {['goForIt', 'thinkCarefully', 'reconsider'].map(type => (
                                <Col md={4} key={type}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h6>
                                        <Button size="sm" variant="outline-success" onClick={() => {
                                            setForm(prev => {
                                                const currentList = prev.verdict?.[type] || [];
                                                return {
                                                    ...prev,
                                                    verdict: {
                                                        ...prev.verdict,
                                                        [type]: [...currentList, ""]
                                                    }
                                                };
                                            });
                                        }}>+</Button>
                                    </div>
                                    {/* {console.log(form.verdict?.[type], type, form.verdict)} */}
                                    {(form.verdict?.[type] || []).map((point, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="d-flex">
                                                <Form.Control
                                                    size="sm"
                                                    value={point}
                                                    onChange={(e) => {
                                                        setForm(prev => {
                                                            const currentList = [...(prev.verdict?.[type] || [])];
                                                            currentList[i] = e.target.value;
                                                            return {
                                                                ...prev,
                                                                verdict: {
                                                                    ...prev.verdict,
                                                                    [type]: currentList
                                                                }
                                                            };
                                                        });
                                                    }}
                                                    isInvalid={!!errors[`verdict.${type}.${i}`]}
                                                />
                                                <Button size="sm" variant="link" className="text-danger" onClick={() => {
                                                    setForm(prev => {
                                                        const currentList = (prev.verdict?.[type] || []).filter((_, idx) => idx !== i);
                                                        return {
                                                            ...prev,
                                                            verdict: {
                                                                ...prev.verdict,
                                                                [type]: currentList
                                                            }
                                                        };
                                                    });
                                                }}>×</Button>
                                            </div>
                                            {errors[`verdict.${type}.${i}`] && <small className="text-danger">{errors[`verdict.${type}.${i}`]}</small>}
                                        </div>
                                    ))}
                                </Col>
                            ))}
                        </Row>
                        <Form.Group className="mt-3">
                            <Form.Label>Disclaimer</Form.Label>
                            <div className={!!errors[`verdict.disclaimer`] ? 'is-invalid ck-error' : ''}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={form.verdict.disclaimer}
                                    config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();



                                        setForm(prev => ({
                                            ...prev,
                                            verdict: {
                                                ...prev.verdict,
                                                disclaimer: data
                                            }
                                        }));
                                    }}
                                />
                            </div>
                            {errors[`verdict.disclaimer`] && <small className="text-danger">{errors[`verdict.disclaimer`]}</small>}
                        </Form.Group>
                    </Card.Body>
                </Card>

                <div className="d-grid gap-2 mb-5">
                    <Button variant="primary" type="submit" size="lg" disabled={loading}>
                        {loading ? "Saving..." : "Save All Editorial Details"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CollegeDetails;
