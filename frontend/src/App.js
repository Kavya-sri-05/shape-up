import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import NutritionChecker from "./pages/NutritionChecker";
import BMRCalculator from "./pages/BMRCalculator";
import About from "./pages/About";
import MealPlanPage from "./pages/MealPlan";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
import MedicationsPage from "./pages/MedicationsPage";
import UpdateDietProfile from "./components/UpdateDietProfile";

// Styles
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#5C6BC0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#F5F7FA'
      }}>
        <Header />
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
          <Routes>
            {/* Redirect root to login if not authenticated, home if authenticated */}
            <Route 
              path="/" 
              element={userInfo ? <Navigate to="/pages/home" replace /> : <Navigate to="/pages/login" replace />} 
            />
            
            {/* Public Routes */}
            <Route path="/pages/about" element={<About />} />

            {/* Authentication Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/pages/login" element={<Login />} />
              <Route path="/pages/register" element={<Register />} />
            </Route>

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/pages/home" element={<Home />} />
              <Route path="/pages/workouts" element={<Workouts />} />
              <Route path="/pages/nutrition-checker" element={<NutritionChecker />} />
              <Route path="/pages/bmr-calculator" element={<BMRCalculator />} />
              <Route path="/pages/meal-plan" element={<MealPlanPage />} />
              <Route path="/pages/medications" element={<MedicationsPage />} />
              <Route path="/pages/diet-profile" element={<UpdateDietProfile />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
