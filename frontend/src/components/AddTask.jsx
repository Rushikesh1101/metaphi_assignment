// DashboardWithTaskDialog.jsx
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import TaskForm from "../pages/TaskForm";  // adjust path as needed

const DashboardWithTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* 1) The button that opens the dialog */}
      <button
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition"
      >
        <AddCircleOutlineIcon />
        <span className="ml-2">Add Task</span>
      </button>

      {/* 2) The MUI Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className: "rounded-2xl p-6",            // Tailwind on the paper
        }}
      >
        <DialogTitle className="text-2xl font-semibold text-gray-800">
          Create New Task
        </DialogTitle>

        <DialogContent className="!p-4">
          {/* Pass handleClose so TaskForm can close on success */}
          <TaskForm onSuccess={handleClose} />
        </DialogContent>

        <DialogActions className="!p-4">
          <Button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardWithTaskDialog;
