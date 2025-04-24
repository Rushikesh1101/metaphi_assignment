import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigator = useNavigate()

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function onLogout(){
    localStorage.clear()
    navigator("/")
    window.location.reload();
  }

  const handleProfile = () => {
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    if (onLogout) onLogout();
  };

  return (
    <AppBar position="static" className="bg-white shadow-md">
      <Toolbar className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">Task Management</div>
        <div className="flex items-center space-x-4">
          {/* Profile menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleOpen} className="text-gray-700">
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfile} className="flex items-center space-x-2">
              <Avatar sx={{ width: 24, height: 24 }} />
              <span className="capitalize">{localStorage.getItem('role')}</span>
            </MenuItem>
            <MenuItem onClick={handleLogout} className="flex items-center space-x-2">
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
