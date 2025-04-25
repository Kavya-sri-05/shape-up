import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useCreateMealPlanMutation,
  useUpdateMealPlanMutation,
} from "../slices/usersApiSlice";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { 
  FaUtensils, 
  FaCoffee, 
  FaCarrot, 
  FaAppleAlt,
  FaMoon,
  FaCookie
} from 'react-icons/fa';

const MealInput = ({ icon: Icon, label, value, onChange, placeholder }) => (
  <Card sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon size={20} style={{ color: '#4A90E2', marginRight: '10px' }} />
        <Typography variant="h6" component="h3" sx={{ color: '#2C3E50' }}>
          {label}
        </Typography>
      </Box>
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4A90E2',
            },
          },
        }}
      />
    </CardContent>
  </Card>
);

const MealPlan = () => {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [meal1, setMeal1] = useState("");
  const [meal2, setMeal2] = useState("");
  const [meal3, setMeal3] = useState("");
  const [meal4, setMeal4] = useState("");
  const [meal5, setMeal5] = useState("");
  const [snacks, setSnacks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [createMealPlan, { isLoading: isCreating }] = useCreateMealPlanMutation();
  const [updateMealPlan, { isLoading: isUpdating }] = useUpdateMealPlanMutation();

  useEffect(() => {
    const fetchMealPlan = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/meal-plan/${currentDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch meal plan');
        }
        const data = await response.json();

        if (data) {
          setMeal1(data.meal1 || "");
          setMeal2(data.meal2 || "");
          setMeal3(data.meal3 || "");
          setMeal4(data.meal4 || "");
          setMeal5(data.meal5 || "");
          setSnacks(data.snacks || "");
        }
      } catch (error) {
        console.error("Fetch meal plan error:", error);
        if (!error.message.includes('not found')) {
          toast.error("Failed to load meal plan");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealPlan();
  }, [currentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const mealPlanData = {
        date: currentDate,
        meal1,
        meal2,
        meal3,
        meal4,
        meal5,
        snacks,
      };

      try {
        await updateMealPlan(mealPlanData).unwrap();
        toast.success("Meal plan updated successfully!");
      } catch (updateError) {
        if (updateError.status === 404) {
          await createMealPlan(mealPlanData).unwrap();
          toast.success("Meal plan created successfully!");
        } else {
          throw updateError;
        }
      }
    } catch (error) {
      console.error("Save meal plan error:", error);
      toast.error(error?.data?.message || "Failed to save meal plan");
    }
  };

  if (isLoading || isCreating || isUpdating) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #EBF4F5 0%, #F7F9FC 100%)'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            color: '#2C3E50',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Daily Meal Planner
        </Typography>

        <Form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#2C3E50' }}>
              Select Date
            </Typography>
            <TextField
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              fullWidth
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1
              }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MealInput
                icon={FaCoffee}
                label="Breakfast"
                value={meal1}
                onChange={(e) => setMeal1(e.target.value)}
                placeholder="Enter your breakfast plan"
              />
              <MealInput
                icon={FaCarrot}
                label="Morning Snack"
                value={meal2}
                onChange={(e) => setMeal2(e.target.value)}
                placeholder="Enter your morning snack"
              />
              <MealInput
                icon={FaUtensils}
                label="Lunch"
                value={meal3}
                onChange={(e) => setMeal3(e.target.value)}
                placeholder="Enter your lunch plan"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MealInput
                icon={FaAppleAlt}
                label="Afternoon Snack"
                value={meal4}
                onChange={(e) => setMeal4(e.target.value)}
                placeholder="Enter your afternoon snack"
              />
              <MealInput
                icon={FaMoon}
                label="Dinner"
                value={meal5}
                onChange={(e) => setMeal5(e.target.value)}
                placeholder="Enter your dinner plan"
              />
              <MealInput
                icon={FaCookie}
                label="Additional Snacks"
                value={snacks}
                onChange={(e) => setSnacks(e.target.value)}
                placeholder="Enter any additional snacks"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || isCreating || isUpdating}
              sx={{
                backgroundColor: '#4A90E2',
                color: 'white',
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#357ABD'
                }
              }}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save Meal Plan'}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Container>
  );
};

export default MealPlan;
