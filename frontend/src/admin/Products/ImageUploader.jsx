import React from "react";
import { FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./ImageUploader.css";

const ImageUploader = ({ images, setImages }) => {

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setImages(items);
  };

  return (
    <div
      className="drop-zone"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input type="file" multiple onChange={handleFileChange} />

      <p>Drag & Drop images here or click to upload</p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              className="image-preview"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((img, index) => (
                <Draggable key={index} draggableId={`${index}`} index={index}>
                  {(provided) => (
                    <div
                      className="image-box"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={img.preview || img.url} alt="" />
                      <button onClick={() => removeImage(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
