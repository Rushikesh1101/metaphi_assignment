import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const EditTaskDialog = ({ task, onClose, onSubmit }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [hoursSpent, setHoursSpent] = useState(task.hours_spent);

  const handleSubmit = () => {
    const updatedTask = { ...task, title, description, hours_spent: hoursSpent, status: 'Pending' };
    onSubmit(updatedTask);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Hours Spent"
          value={hoursSpent}
          onChange={(e) => setHoursSpent(e.target.value)}
          type="number"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
