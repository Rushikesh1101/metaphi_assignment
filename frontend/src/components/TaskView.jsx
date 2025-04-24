import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Tag as TagIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";

const TaskView = ({ isViewDialogOpen, selectedTask, setViewDialogOpen }) => {
  return (
    <>
      <Dialog
        open={isViewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        className="w-full"
      >
        <DialogTitle className="flex items-center space-x-3 bg-blue-600 text-white p-4 rounded-t-lg">
          <AssignmentIcon fontSize="large" />
          <Typography variant="h6" className="font-semibold">
            Task Details
          </Typography>
        </DialogTitle>
        <DialogContent className="p-6 bg-gray-50 mt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <TagIcon className="text-blue-500" />
              <Typography className="text-lg">
                <b>Title:</b> {selectedTask.title}
              </Typography>
            </div>
            <div className="flex items-start space-x-3">
              <EditIcon className="text-green-500 mt-1" />
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <Typography className="text-lg font-bold">
                    <b>Description:</b>
                  </Typography>
                </div>
                <textarea
                  readOnly
                  value={selectedTask.description}
                  className="w-[30rem] p-3 mt-2 text-gray-700 bg-white rounded-md resize-none focus:outline-none"
                  rows={5}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TagIcon className="text-yellow-500" />
              <Typography className="text-lg">
                <b>Tags:</b> {selectedTask.tags}
              </Typography>
            </div>
            <div className="flex items-center space-x-3">
              <AccessTimeIcon className="text-purple-500" />
              <Typography className="text-lg">
                <b>Hours Spent:</b> {selectedTask.hours_spent}
              </Typography>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarTodayIcon className="text-orange-500" />
              <Typography className="text-lg">
                <b>Date:</b> {selectedTask.task_date}
              </Typography>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircleIcon
                className={`${
                  selectedTask.status === "Approved"
                    ? "text-green-500"
                    : selectedTask.status === "Rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              />
              <Typography className="text-lg">
                <b>Status:</b> {selectedTask.status}
              </Typography>
            </div>
            {selectedTask.status === "Rejected" && (
              <div className="flex items-center space-x-3">
                <ThumbDownIcon className="text-red-500" />
                <Typography className="text-lg">
                  <b>Rejection Reason:</b> {selectedTask.rejection_comment}
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-100 rounded-b-lg">
          <Button
            onClick={() => setViewDialogOpen(false)}
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskView;
