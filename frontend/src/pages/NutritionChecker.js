import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import NutritionCheckerForm from "../components/NutritionCheckerForm";
import Footer from "../components/Footer";
import { FaLeaf } from 'react-icons/fa';

const NutritionChecker = () => {
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
              <FaLeaf size={40} style={{ color: '#4A90E2' }} />
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  color: '#2C3E50',
                  fontWeight: 'bold'
                }}
              >
                Nutrition Checker
              </Typography>
            </Box>

            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center" 
              sx={{ mb: 4, maxWidth: 600 }}
            >
              Analyze your food's nutritional content and make informed decisions about your diet.
            </Typography>

            <Box sx={{ 
              width: '100%', 
              maxWidth: 800,
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
              <NutritionCheckerForm />
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default NutritionChecker;
