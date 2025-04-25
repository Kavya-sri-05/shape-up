import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import ExercisePage from "../components/ExerciseDB";
import Footer from "../components/Footer";
import { FaDumbbell } from 'react-icons/fa';

const Workouts = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #EBF4F5 0%, #F7F9FC 100%)'
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "70vh",
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4 
            }}>
              <FaDumbbell size={40} style={{ color: '#4A90E2' }} />
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  color: '#2C3E50',
                  fontWeight: 'bold'
                }}
              >
                Workout Exercises
              </Typography>
            </Box>

            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center" 
              sx={{ mb: 4, maxWidth: 800 }}
            >
              Explore our comprehensive database of exercises and create your perfect workout routine.
              Search by muscle group or exercise type to find the right exercises for your goals.
            </Typography>

            <Box sx={{ 
              width: '100%',
              '& .form-control': {
                borderRadius: 1,
                border: '1px solid #E0E0E0',
                '&:focus': {
                  borderColor: '#4A90E2',
                  boxShadow: '0 0 0 0.2rem rgba(74, 144, 226, 0.25)'
                }
              },
              '& .btn-primary': {
                backgroundColor: '#4A90E2',
                borderColor: '#4A90E2',
                '&:hover': {
                  backgroundColor: '#357ABD'
                }
              },
              '& .card': {
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              },
              '& .exercise-image': {
                borderRadius: '8px 8px 0 0',
                objectFit: 'cover'
              }
            }}>
              <ExercisePage />
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default Workouts;
