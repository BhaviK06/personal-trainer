import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import CalendarView from './components/CalendarView';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventIcon from '@mui/icons-material/Event';


const drawerWidth = 240;

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },

            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem button component={Link} to="/">
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItem>
                <ListItem button component={Link} to="/trainings">
                  <ListItemIcon><FitnessCenterIcon /></ListItemIcon>
                  <ListItemText primary="Trainings" />
                </ListItem>
                <ListItem button component={Link} to="/calendar">
  <ListItemIcon><EventIcon /></ListItemIcon>
  <ListItemText primary="Calendar" />
</ListItem>

              </List>
            </Box>
          </Drawer>

          
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <Typography variant="h6" noWrap component="div">
                  PersonalTrainer
                </Typography>
              </Toolbar>
            </AppBar>

            
            <Toolbar />

            
            <Routes>
              <Route path="/" element={<CustomerList />} />
              <Route path="/trainings" element={<TrainingList />} />
              <Route path="/calendar" element={<CalendarView />} />

            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;