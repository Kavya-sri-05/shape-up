import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import CalorieCalculator from "../components/CalorieCalculator";
import Footer from "../components/Footer";
import { FaCalculator } from 'react-icons/fa';

const BMRCalculator = () => {
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
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4 
            }}>
              <FaCalculator size={40} style={{ color: '#4A90E2' }} />
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  color: '#2C3E50',
                  fontWeight: 'bold'
                }}
              >
                BMR Calculator
              </Typography>
            </Box>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center" 
              sx={{ mb: 4, maxWidth: 600 }}
            >
              Calculate your Basal Metabolic Rate to understand your daily caloric needs 
              and optimize your fitness journey.
            </Typography>

            <Box sx={{ 
              width: '100%', 
              maxWidth: 600,
              mx: 'auto',
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
              }
            }}>
              <CalorieCalculator />
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default BMRCalculator;
