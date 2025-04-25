import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, TextField, Checkbox, FormControlLabel, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { FaPills } from 'react-icons/fa';
import { Pill, Plus, X, Edit2, Trash2, Calendar, Clock, QrCode } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import Footer from "../components/Footer";
import MedicationQRScanner from '../components/MedicationQRScanner';
import MedicationExpiryWarning from '../components/MedicationExpiryWarning';

const MedicationsPage = () => {
  const [medicationList, setMedicationList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: '',
    manufacturingDate: '',
    expiryDate: '',
    notes: '',
    active: true
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
      startDate: new Date().toISOString().substr(0, 10),
      endDate: '',
      manufacturingDate: '',
      expiryDate: '',
      notes: '',
      active: true
    });
    setEditingMedication(null);
  };

  // Open form to add medication
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form to edit medication
  const openEditForm = (medication) => {
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      startDate: new Date(medication.startDate).toISOString().substr(0, 10),
      endDate: medication.endDate ? new Date(medication.endDate).toISOString().substr(0, 10) : '',
      manufacturingDate: medication.manufacturingDate ? new Date(medication.manufacturingDate).toISOString().substr(0, 10) : '',
      expiryDate: medication.expiryDate ? new Date(medication.expiryDate).toISOString().substr(0, 10) : '',
      notes: medication.notes || '',
      active: medication.active
    });
    setEditingMedication(medication);
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const medicationData = {
      ...formData,
      endDate: formData.endDate || null,
      id: editingMedication ? editingMedication.id : Date.now()
    };
    
    if (editingMedication) {
      setMedicationList(prevList => 
        prevList.map(med => med.id === editingMedication.id ? medicationData : med)
      );
    } else {
      setMedicationList(prevList => [...prevList, medicationData]);
    }
    
    setShowForm(false);
    resetForm();
  };

  // Handle medication deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedicationList(prevList => prevList.filter(med => med.id !== id));
    }
  };

  // Handle QR scan complete
  const handleScanComplete = (scanData) => {
    // Format dates to YYYY-MM-DD format for form inputs
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      try {
        return new Date(dateString).toISOString().substr(0, 10);
      } catch (e) {
        return '';
      }
    };

    // Merge scanned data with default values for missing fields
    setFormData({
      name: scanData.name || '',
      dosage: scanData.dosage || '',
      frequency: scanData.frequency || '',
      time: scanData.time || '',
      startDate: formatDateForInput(scanData.startDate) || new Date().toISOString().substr(0, 10),
      endDate: formatDateForInput(scanData.endDate) || '',
      manufacturingDate: formatDateForInput(scanData.manufacturingDate) || '',
      expiryDate: formatDateForInput(scanData.expiryDate) || '',
      notes: scanData.notes || 'Imported from QR code scan',
      active: true // Default to active for new medications
    });
    
    setShowScanner(false);
    setShowForm(true);
  };

  // Group medications by activity status
  const groupedMedications = () => {
    return {
      active: medicationList.filter(med => med.active),
      inactive: medicationList.filter(med => !med.active)
    };
  };

  const { active: activeMedications, inactive: inactiveMedications } = groupedMedications();

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
          <Box sx={{ minHeight: "70vh" }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FaPills size={40} style={{ color: '#4A90E2' }} />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    color: '#2C3E50',
                    fontWeight: 'bold'
                  }}
                >
                  Medications
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<QrCode />}
                  onClick={() => setShowScanner(true)}
                >
                  Scan QR Code
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={openAddForm}
                >
                  Add Medication
                </Button>
              </Box>
            </Box>

            {/* Active Medications */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Active Medications
              </Typography>
              
              {activeMedications.length > 0 ? (
                <Grid container spacing={3}>
                  {activeMedications.map(medication => (
                    <Grid item xs={12} key={medication.id}>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: 3
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                height: 'fit-content'
                              }}
                            >
                              <Pill size={24} />
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                                {medication.name}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                {medication.dosage}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Clock size={16} />
                                  <Typography variant="body2" color="text.secondary">
                                    {medication.time}, {medication.frequency}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} />
                                  <Typography variant="body2" color="text.secondary">
                                    Started {format(parseISO(medication.startDate), 'MMM d, yyyy')}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {medication.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {medication.notes}
                                </Typography>
                              )}
                              
                              {medication.expiryDate && (
                                <Box sx={{ mt: 2 }}>
                                  <MedicationExpiryWarning medication={medication} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Box>
                            <IconButton 
                              onClick={() => openEditForm(medication)}
                              color="primary"
                            >
                              <Edit2 size={20} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDelete(medication.id)}
                              color="error"
                            >
                              <Trash2 size={20} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    color: 'text.secondary',
                    borderRadius: 2
                  }}
                >
                  <Typography>No active medications.</Typography>
                </Paper>
              )}
            </Box>

            {/* Inactive Medications */}
            {inactiveMedications.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  Inactive Medications
                </Typography>
                
                <Grid container spacing={3}>
                  {inactiveMedications.map(medication => (
                    <Grid item xs={12} key={medication.id}>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          opacity: 0.7,
                          '&:hover': {
                            opacity: 0.9,
                            boxShadow: 2
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                height: 'fit-content'
                              }}
                            >
                              <Pill size={24} />
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                                {medication.name}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                {medication.dosage}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Clock size={16} />
                                  <Typography variant="body2" color="text.secondary">
                                    {medication.time}, {medication.frequency}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Calendar size={16} />
                                  <Typography variant="body2" color="text.secondary">
                                    Started {format(parseISO(medication.startDate), 'MMM d, yyyy')}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {medication.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {medication.notes}
                                </Typography>
                              )}
                              
                              {medication.expiryDate && (
                                <Box sx={{ mt: 2 }}>
                                  <MedicationExpiryWarning medication={medication} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Box>
                            <IconButton 
                              onClick={() => openEditForm(medication)}
                              color="primary"
                            >
                              <Edit2 size={20} />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDelete(medication.id)}
                              color="error"
                            >
                              <Trash2 size={20} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Empty State */}
            {medicationList.length === 0 && (
              <Paper 
                sx={{ 
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 2
                }}
              >
                <Pill size={48} style={{ color: '#94A3B8', margin: '0 auto 16px' }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Medications Yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Start tracking your medications to receive timely reminders.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<QrCode />}
                    onClick={() => setShowScanner(true)}
                  >
                    Scan QR Code
                  </Button>
                  <Button
                    variant="contained"
                    onClick={openAddForm}
                  >
                    Add Manually
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Add/Edit Form Dialog */}
            <Dialog 
              open={showForm} 
              onClose={() => setShowForm(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {editingMedication ? 'Edit Medication' : 'Add Medication'}
                  </Typography>
                  <IconButton onClick={() => setShowForm(false)} size="small">
                    <X />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
                  <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Medication Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="E.g., Aspirin, Vitamin D"
                      />
                    </Grid>

                    {/* Dosage */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dosage"
                        name="dosage"
                        required
                        value={formData.dosage}
                        onChange={handleChange}
                        placeholder="E.g., 500mg, 2 tablets"
                      />
                    </Grid>

                    {/* Frequency and Time */}
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Frequency"
                        name="frequency"
                        required
                        value={formData.frequency}
                        onChange={handleChange}
                        placeholder="E.g., Daily, Twice daily"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="E.g., Morning, 8:00 AM"
                      />
                    </Grid>

                    {/* Start and End Dates */}
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="End Date (optional)"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Manufacturing and Expiry Dates */}
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Manufacturing Date"
                        name="manufacturingDate"
                        type="date"
                        required
                        value={formData.manufacturingDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        type="date"
                        required
                        value={formData.expiryDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Notes */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes (optional)"
                        name="notes"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any additional information about this medication"
                      />
                    </Grid>

                    {/* Active Status */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.active}
                            onChange={handleChange}
                            name="active"
                            color="primary"
                          />
                        }
                        label="This medication is currently active"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  type="submit"
                >
                  {editingMedication ? 'Update' : 'Save'} Medication
                </Button>
              </DialogActions>
            </Dialog>

            {/* QR Scanner Dialog */}
            <Dialog
              open={showScanner}
              onClose={() => setShowScanner(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogContent sx={{ p: 0 }}>
                <MedicationQRScanner 
                  onScanComplete={handleScanComplete}
                  onClose={() => setShowScanner(false)}
                />
              </DialogContent>
            </Dialog>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default MedicationsPage; 