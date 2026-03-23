import React, { useState } from "react";
import { Form, Badge } from "react-bootstrap";

const TagInput = ({ tags, setTags }) => {

  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();

      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }

      setInput("");
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <div className="tag-input-wrapper">

      <div className="tag-container">

        {tags.map((tag, i) => (
          <Badge
            bg="primary"
            key={i}
            className="me-2 mb-2 tag-badge"
          >
            {tag}
            <span
              className="tag-close"
              onClick={() => removeTag(i)}
            >
              ×
            </span>
          </Badge>
        ))}

        <Form.Control
          className="tag-input"
          value={input}
          placeholder="Type tag & press Enter"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

      </div>

    </div>
  );
};

export default TagInput;