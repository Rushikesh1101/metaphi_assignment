import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Chip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Tag as TagIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import DashboardWithTaskDialog from "./AddTask";
import EditTaskDialog from "./EditTaskDialog";
import TaskView from "./TaskView";

const EmployeeDashboard = ({ role, tasks, updateTask }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setViewDialogOpen(true);
  };

  const handleEditSubmit = (updatedTask) => {
    updateTask(updatedTask);
    setEditDialogOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const stats = {
    total: tasks.length,
    approved: tasks.filter((task) => task.status === "Approved").length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    rejected: tasks.filter((task) => task.status === "Rejected").length,
  };

  return (
    <Box className="p-6">
      {/* Header */}
      <Box className="flex items-center justify-between mb-8">
        <Typography
          variant="h4"
          className="flex items-center space-x-3 text-blue-600"
        >
          <AssignmentIcon fontSize="large" />
          <span className="capitalize">{role} Dashboard</span>
        </Typography>
        <DashboardWithTaskDialog />
      </Box>

      {/* Stats */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Chip
          label={`Total: ${stats.total}`}
          color="primary"
          className="p-2 text-lg"
        />
        <Chip
          label={`Approved: ${stats.approved}`}
          color="success"
          className="p-2 text-lg"
        />
        <Chip
          label={`Pending: ${stats.pending}`}
          color="warning"
          className="p-2 text-lg"
        />
        <Chip
          label={`Rejected: ${stats.rejected}`}
          color="error"
          className="p-2 text-lg"
        />
      </Box>

      {/* Filters */}
      <Box className="flex items-center space-x-4 mb-6">
        <FormControl className="w-1/3">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="w-2/3"
          label="Search by title or description"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Task Table */}
      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 text-white">
              <TableCell sx={{fontWeight: 900}}>Title</TableCell>
              <TableCell sx={{fontWeight: 900}}>Description</TableCell>
              <TableCell sx={{fontWeight: 900}}>Tags</TableCell>
              <TableCell sx={{fontWeight: 900}}>Hours</TableCell>
              <TableCell sx={{fontWeight: 900}}>Date</TableCell>
              <TableCell sx={{fontWeight: 900}}>Status</TableCell>
              <TableCell sx={{fontWeight: 900}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {task.description}
                  </TableCell>{" "}
                  <TableCell>
                    <Chip
                      key={task.tags}
                      label={task.tags}
                      icon={<TagIcon />}
                      className="mr-1"
                    />
                  </TableCell>
                  <TableCell>{task.hours_spent}</TableCell>
                  <TableCell>{task.task_date}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={
                        task.status === "Approved"
                          ? "success"
                          : task.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewClick(task)}
                      color="secondary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {(task.status === "Pending" ||
                      task.status === "Rejected") && (
                      <IconButton
                        onClick={() => handleEditClick(task)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="h6" className="text-gray-500">
                    No tasks found matching the criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Task Dialog */}
      {isEditDialogOpen && (
        <EditTaskDialog
          task={selectedTask}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* View Task Dialog */}
      {isViewDialogOpen && selectedTask && (
        <TaskView
          isViewDialogOpen={isViewDialogOpen}
          selectedTask={selectedTask}
          setViewDialogOpen={setViewDialogOpen}
        />
      )}
    </Box>
  );
};

export default EmployeeDashboard;
