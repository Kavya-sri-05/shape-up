import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FaUtensils, FaWeight, FaPills, FaCalendarAlt, FaClock, FaCoffee, FaCarrot, FaAppleAlt, FaMoon, FaCookie } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { MdEdit, MdExpandMore, MdDelete } from 'react-icons/md';
import { useGetAllMealPlansQuery, useGetAllMedicationsQuery, useDeleteMealPlanMutation, useDeleteMedicationMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [dietProfile, setDietProfile] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState('mealPlans');
  
  const { 
    data: mealPlansData, 
    isLoading: isMealPlansLoading, 
    error: mealPlansError,
    refetch: refetchMealPlans
  } = useGetAllMealPlansQuery();

  const {
    data: medicationsData,
    isLoading: isMedicationsLoading,
    error: medicationsError,
    refetch: refetchMedications
  } = useGetAllMedicationsQuery();

  const [deleteMealPlan] = useDeleteMealPlanMutation();
  const [deleteMedication] = useDeleteMedicationMutation();

  const mealPlans = mealPlansData?.data || [];
  const medications = medicationsData?.data || [];
  const activeMedications = medications.filter(med => med.active);

  useEffect(() => {
    // Load diet profile from localStorage
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      setDietProfile(JSON.parse(profileData));
    }

    // Show errors if data fetch fails
    if (mealPlansError) {
      toast.error('Failed to load meal plans');
    }
    if (medicationsError) {
      toast.error('Failed to load medications');
    }
  }, [mealPlansError, medicationsError]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'meal1': return <FaCoffee />;
      case 'meal2': return <FaCarrot />;
      case 'meal3': return <FaUtensils />;
      case 'meal4': return <FaAppleAlt />;
      case 'meal5': return <FaMoon />;
      case 'snacks': return <FaCookie />;
      default: return <FaUtensils />;
    }
  };

  const getMealLabel = (mealType) => {
    switch(mealType) {
      case 'meal1': return 'Breakfast';
      case 'meal2': return 'Morning Snack';
      case 'meal3': return 'Lunch';
      case 'meal4': return 'Afternoon Snack';
      case 'meal5': return 'Dinner';
      case 'snacks': return 'Additional Snacks';
      default: return mealType;
    }
  };

  const getMealCount = (plan) => {
    return Object.entries(plan)
      .filter(([key, value]) => 
        ['meal1', 'meal2', 'meal3', 'meal4', 'meal5', 'snacks'].includes(key) && 
        value && 
        value.trim().length > 0
      ).length;
  };

  const handleDeleteMealPlan = async (date) => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      await deleteMealPlan(formattedDate);
      await refetchMealPlans();
      toast.success('Meal plan deleted successfully');
    } catch (err) {
      console.error('Delete meal plan error:', err);
      toast.error(err?.data?.message || 'Failed to delete meal plan');
    }
  };

  const handleDeleteMedication = async (id) => {
    try {
      await deleteMedication(id);
      await refetchMedications();
      toast.success('Medication deleted successfully');
    } catch (err) {
      console.error('Delete medication error:', err);
      toast.error(err?.data?.message || 'Failed to delete medication');
    }
  };

  if (isMealPlansLoading || isMedicationsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <GiMuscleUp size={40} color="#4A90E2" />
        Your Health Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Diet Profile Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaWeight /> Diet Profile
                </Typography>
                <Button
                  component={Link}
                  to="/pages/diet-profile"
                  startIcon={<MdEdit />}
                  variant="outlined"
                  size="small"
                >
                  Edit Profile
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dietProfile ? (
                <List dense>
                  <ListItem>
                    <ListItemText primary="Current Weight" secondary={`${dietProfile.weight} kg`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Goal Weight" secondary={`${dietProfile.goalWeight} kg`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Activity Level" secondary={dietProfile.activityLevel} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Goal" secondary={dietProfile.goal} />
                  </ListItem>
                </List>
              ) : (
                <Typography color="text.secondary">No diet profile set up yet.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Stats</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h4">{mealPlans.length}</Typography>
                    <Typography variant="subtitle2">Saved Meal Plans</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h4">{activeMedications.length}</Typography>
                    <Typography variant="subtitle2">Active Medications</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Sections */}
      <Box sx={{ mt: 4 }}>
        {/* Saved Meal Plans Section */}
        <Accordion 
          expanded={expandedAccordion === 'mealPlans'} 
          onChange={handleAccordionChange('mealPlans')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<MdExpandMore />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaUtensils /> Saved Meal Plans
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {mealPlans.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Meals</TableCell>
                      <TableCell>Total Meals</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mealPlans.map((plan) => (
                      <TableRow key={plan.date}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaCalendarAlt />
                            {new Date(plan.date).toLocaleDateString()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {Object.entries(plan).map(([key, value]) => {
                              if (['meal1', 'meal2', 'meal3', 'meal4', 'meal5', 'snacks'].includes(key) && value && value.trim().length > 0) {
                                let label = '';
                                let icon = null;
                                
                                switch(key) {
                                  case 'meal1':
                                    label = `Breakfast: ${value}`;
                                    icon = <FaCoffee />;
                                    break;
                                  case 'meal2':
                                    label = `Morning Snack: ${value}`;
                                    icon = <FaCarrot />;
                                    break;
                                  case 'meal3':
                                    label = `Lunch: ${value}`;
                                    icon = <FaUtensils />;
                                    break;
                                  case 'meal4':
                                    label = `Afternoon Snack: ${value}`;
                                    icon = <FaAppleAlt />;
                                    break;
                                  case 'meal5':
                                    label = `Dinner: ${value}`;
                                    icon = <FaMoon />;
                                    break;
                                  case 'snacks':
                                    label = `Snacks: ${value}`;
                                    icon = <FaCookie />;
                                    break;
                                  default:
                                    return null;
                                }
                                
                                return (
                                  <Chip
                                    key={key}
                                    icon={icon}
                                    label={label}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ maxWidth: 300 }}
                                  />
                                );
                              }
                              return null;
                            })}
                          </Box>
                        </TableCell>
                        <TableCell>{getMealCount(plan)} meals</TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to="/pages/meal-plan"
                            startIcon={<MdEdit />}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            onClick={() => handleDeleteMealPlan(plan.date)}
                            color="error"
                            size="small"
                            title="Delete meal plan"
                          >
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary" align="center">
                No meal plans saved yet. <Link to="/pages/meal-plan">Create your first meal plan</Link>
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Medications Section */}
        <Accordion 
          expanded={expandedAccordion === 'medications'} 
          onChange={handleAccordionChange('medications')}
        >
          <AccordionSummary expandIcon={<MdExpandMore />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaPills /> Medications
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {medications.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medications.map((medication) => (
                      <TableRow key={medication._id}>
                        <TableCell>{medication.name}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaClock />
                            {medication.frequency}, {medication.time}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={medication.active ? "Active" : "Inactive"}
                            color={medication.active ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to="/pages/medications"
                            startIcon={<MdEdit />}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            onClick={() => handleDeleteMedication(medication._id)}
                            color="error"
                            size="small"
                            title="Delete medication"
                          >
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary" align="center">
                No medications added yet. <Link to="/pages/medications">Add your first medication</Link>
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Dashboard; 