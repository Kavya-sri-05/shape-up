import React from 'react';
import { Link } from "react-router-dom";
import { Box, Stack, Typography, Button } from '@mui/material';
import styled from '@emotion/styled';
import HeroBannerImage from '../assets/images/banner.png';

const HeroContainer = styled(Box)`
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 20px;
  overflow: hidden;
  margin: 20px 0;
  padding: 40px;
`;

const ContentBox = styled(Box)`
  max-width: 600px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #4A90E2 0%, #5C6BC0 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5C6BC0 0%, #4A90E2 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const HeroBanner = () => {
  return (
    <HeroContainer>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={4} 
        alignItems="center"
        justifyContent="space-between"
      >
        <ContentBox>
          <Typography 
            color="#4A90E2" 
            fontWeight="600" 
            fontSize={{ xs: '26px', md: '32px' }}
            mb={2}
          >
            Health & Fitness App
          </Typography>
          <Typography 
            fontWeight={700} 
            sx={{ 
              fontSize: { xs: '32px', md: '44px' },
              lineHeight: 1.2,
              mb: 3
            }}
          >
            Transform Your Life <br />
            One Healthy Choice <br />
            At a Time
          </Typography>
          <Typography 
            fontSize={{ xs: '16px', md: '18px' }}
            color="text.secondary"
            mb={4}
          >
            Track workouts, monitor nutrition, calculate BMR, and achieve your fitness goals with our comprehensive platform.
          </Typography>
          <StyledButton 
            component={Link}
            to="/pages/register"
          >
            Start Your Journey
          </StyledButton>
        </ContentBox>
        <Box 
          sx={{
            maxWidth: { xs: '300px', md: '400px' },
            width: '100%'
          }}
        >
          <img
            src={HeroBannerImage}
            alt="fitness banner"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
            }}
          />
        </Box>
      </Stack>
    </HeroContainer>
  );
};

export default HeroBanner;
