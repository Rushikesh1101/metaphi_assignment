import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  FilterList,
  Download,
  CheckCircle,
  Cancel,
  Refresh,
  Search,
  DateRange,
  Person,
  Label,
  AccessTime,
  Dashboard,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  FileDownload,
  Group,
  Task,
  Visibility as VisibilityIcon,

} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Tooltip,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import TaskView from "./TaskView";

const ManagerDashboard = ({
  role,
  tasks,
  employees,
  status,
  error,
  onApprove,
  onReject,
  onRefresh,
}) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewClick = (task) => {
    setViewDialogOpen(true);
  };

  // Extract all unique tags from tasks
  const allTags = useMemo(() => {
    const tags = new Set();
    tasks.forEach((task) => {
      if (task.tags && task.tags.length > 0) {
        tags.add(task.tags);
      }
    });
    return Array.from(tags);
  }, [tasks]);

  // Filtered tasks based on all filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" || task.status.toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesEmployee =
        employeeFilter === "All" ||
        task.employee_id === employeeFilter ||
        task.employee_name
          ?.toLowerCase()
          .includes(employeeFilter.toLowerCase());
      const matchesTag =
        tagFilter === "All" || (task.tags && task.tags.includes(tagFilter));

      // Basic date filtering (would be enhanced with actual date comparison in production)
      const matchesDate =
        dateRange === "All" ||
        (dateRange === "This Week" && task.task_date) || // Add actual date comparison
        (dateRange === "This Month" && task.task_date); // Add actual date comparison

      return (
        matchesFilter &&
        matchesSearch &&
        matchesEmployee &&
        matchesTag &&
        matchesDate
      );
    });
  }, [tasks, filter, search, employeeFilter, tagFilter, dateRange]);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === "Pending").length;
    const approved = tasks.filter((task) => task.status === "Approved").length;
    const rejected = tasks.filter((task) => task.status === "Rejected").length;

    // Calculate total hours
    const totalHours = tasks.reduce(
      (sum, task) => sum + (task.hours_spent || 0),
      0
    );

    // Find most used tag
    const tagCounts = {};
    tasks.forEach((task) => {
      if (task.tags) {
        tagCounts[task.tags] = (tagCounts[task.tags] || 0) + 1;
      }
    });
    const mostUsedTag =
      Object.keys(tagCounts).length > 0
        ? Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0]
        : "No tags";

    return {
      total,
      pending,
      approved,
      rejected,
      totalHours,
      mostUsedTag,
      pendingApprovals: pending,
    };
  }, [tasks]);

  // Weekly progress data
  const weeklyProgressData = useMemo(() => {
    // Group tasks by employee and sum hours
    const employeeHours = {};
    tasks.forEach((task) => {
      let empName = "";
      employees.map(
        (emp) =>
          // empName = task.employee || `Employee ${task.employee}`
          (empName = emp.id === task.employee && emp.username)
      );
      employeeHours[empName] =
        (employeeHours[empName] || 0) + (task.hours_spent || 0);
    });

    return Object.entries(employeeHours).map(([name, hours]) => ({
      name,
      hours,
    }));
  }, [tasks]);

  const handleApprove = (id) => {
    if (onApprove) onApprove(id);
  };

  const handleReject = (id) => {
    const reason = window.prompt("Please enter rejection reason:");
    if (reason !== null && onReject) {
      onReject(id, reason.trim());
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <Task className="mr-2 text-blue-500" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "employee",
      headerName: "Employee",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <Person className="mr-2 text-gray-500" />
          {employees.map(
            (emp) =>
              emp.id === params.row.employee && <span>{`${emp.username}`}</span>
          )}
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="truncate">
            {params.value.length > 50
              ? `${params.value.slice(0, 50)}...`
              : params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "hours_spent",
      headerName: "Hours",
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex items-center">
          <AccessTime className="mr-1 text-gray-500" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "task_date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <DateRange className="mr-1 text-gray-500" />
          <span>{new Date(params.value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center mt-3">
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            avatar={<Avatar>{params.value}</Avatar>}
          />
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          className="font-bold"
          color={
            params.value === "Approved"
              ? "success"
              : params.value === "Rejected"
              ? "error"
              : "warning"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex space-x-2">
          {params.row.status === "Pending" && (
            <>
              <div title="Approve">
                <IconButton
                  color="success"
                  onClick={() => handleApprove(params.row.id)}
                >
                  <CheckCircle />
                </IconButton>
              </div>
              <div title="Reject">
                <IconButton
                  color="error"
                  onClick={() => handleReject(params.row.id)}
                >
                  <Cancel />
                </IconButton>
              </div>
            </>
          )}
          <Box>
            <IconButton title="View Details" onClick={() => handleViewClick(params.row)} color="secondary">
              <VisibilityIcon />
            </IconButton>

            {isViewDialogOpen && params.row && (
              <TaskView
                isViewDialogOpen={isViewDialogOpen}
                selectedTask={params.row}
                setViewDialogOpen={setViewDialogOpen}
              />
            )}
          </Box>
        </div>
      ),
    },
  ];

  const pieData = [
    { name: "Approved", value: stats.approved, color: "#4caf50" },
    { name: "Pending", value: stats.pending, color: "#ff9800" },
    { name: "Rejected", value: stats.rejected, color: "#f44336" },
  ];

  return (
    <div className="container-fluid mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Dashboard className="text-blue-600 mr-3" fontSize="large" />
          <Typography variant="h4" className="text-gray-800 font-bold capitalize">
            {role} Dashboard
          </Typography>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
          >
            Refresh Data
          </Button>
          <CSVLink
            data={tasks}
            filename={`${role.toLowerCase()}-tasks-${new Date()
              .toISOString()
              .slice(0, 10)}.csv`}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownload />}
            >
              Export CSV
            </Button>
          </CSVLink>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<Task fontSize="large" />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<CheckCircle fontSize="large" />}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Total Hours"
          value={stats.totalHours}
          icon={<AccessTime fontSize="large" />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Most Used Tag"
          value={stats.mostUsedTag}
          icon={<Label fontSize="large" />}
          color="bg-green-100 text-green-600"
          isTag
        />
      </div>

      {/* Reports Section */}
      <Typography variant="h6" className="mb-4 flex items-center text-gray-700">
        <BarChartIcon className="mr-2" /> Reports & Analytics
      </Typography>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Weekly Progress by Employee">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#6366f1" name="Hours Worked" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Task Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Team Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <Typography
            variant="h6"
            className="flex items-center text-gray-800 mb-2 md:mb-0"
          >
            <Group className="mr-2" /> Team Tasks
          </Typography>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <TextField
              label="Search Tasks"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search className="mr-2 text-gray-400" />,
              }}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Status"
              startAdornment={<FilterList className="mr-2 text-gray-400" />}
            >
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              label="Employee"
              startAdornment={<Person className="mr-2 text-gray-400" />}
            >
              <MenuItem value="All">All Employees</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Tag</InputLabel>
            <Select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              label="Tag"
              startAdornment={<Label className="mr-2 text-gray-400" />}
            >
              <MenuItem value="All">All Tags</MenuItem>
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
              startAdornment={<DateRange className="mr-2 text-gray-400" />}
            >
              {["All", "This Week", "This Month", "Last Month"].map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Data Grid */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-64">
            <Typography>Loading tasks...</Typography>
          </div>
        )}
        {status === "failed" && (
          <div className="bg-red-50 p-4 rounded-lg">
            <Typography color="error">Error: {error}</Typography>
          </div>
        )}
        {status === "succeeded" && (
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
        )}
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, isTag = false }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="flex justify-between items-center">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div className="text-right">
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" className="font-bold">
          {isTag ? (
            <Chip label={value} color="primary" variant="outlined" />
          ) : (
            value
          )}
        </Typography>
      </div>
    </CardContent>
  </Card>
);

// Reusable Report Card Component
const ReportCard = ({ title, children }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
    <CardContent>
      <Typography variant="h6" className="mb-4 text-gray-700">
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default ManagerDashboard;
