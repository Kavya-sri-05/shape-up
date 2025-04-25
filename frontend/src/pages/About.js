import React from 'react';
import { Container, Typography, Paper, Box, Grid, Button } from '@mui/material';
import { 
  FaDumbbell, 
  FaUtensils, 
  FaCalculator, 
  FaChartLine,
  FaDatabase,
  FaUserCog
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

const About = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: FaDumbbell,
      title: "Workout Planner",
      description: "Create and customize workout plans with our extensive exercise database. Get detailed instructions and video demonstrations."
    },
    {
      icon: FaUtensils,
      title: "Meal Planning",
      description: "Plan and track your meals, update your meal plans, and maintain a healthy diet with our comprehensive meal planning tools."
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
      {/* About Section */}
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          About Us
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#5C6BC0', mb: 3 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            At Health & Fitness, we're dedicated to helping you achieve your fitness goals and maintain a healthy lifestyle. 
            Our platform provides comprehensive tools and resources to support your wellness journey.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're just starting your fitness journey or looking to take your training to the next level, 
            we provide the tools and support you need to succeed.
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/pages/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/pages/login')}
            >
              Sign In
            </Button>
          </Box>
        </Paper>

        {/* Features Section */}
        <Typography 
          variant="h3" 
          component="h2" 
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

export default About;
