import React from 'react';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import { 
  FaDumbbell, 
  FaUtensils, 
  FaCalculator, 
  FaChartLine,
  FaDatabase,
  FaUserCog
} from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper elevation={2} sx={{ 
    p: 3, 
    borderRadius: 2, 
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  }}>
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Icon size={40} style={{ color: '#4A90E2' }} />
    </Box>
    <Typography variant="h6" gutterBottom align="center">
      {title}
    </Typography>
    <Typography variant="body2" align="center" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const Features = () => {
  const features = [
    {
      icon: FaDumbbell,
      title: "Workout Planner",
      description: "Create and customize workout plans with our extensive exercise database. Get detailed instructions and video demonstrations."
    },
    {
      icon: FaUtensils,
      title: "Nutrition Checker",
      description: "Track your daily nutrition intake, analyze meal components, and get recommendations for a balanced diet."
    },
    {
      icon: FaCalculator,
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate to understand your daily caloric needs and optimize your fitness goals."
    },
    {
      icon: FaChartLine,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed progress charts and achievement milestones."
    },
    {
      icon: FaDatabase,
      title: "Exercise Database",
      description: "Access our comprehensive database of exercises with detailed instructions and muscle group targeting."
    },
    {
      icon: FaUserCog,
      title: "Personalization",
      description: "Get personalized recommendations based on your fitness level, goals, and preferences."
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#4A90E2',
            mb: 4 
          }}
        >
          Our Features
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Features;
