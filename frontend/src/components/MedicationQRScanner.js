import React, { useState, useRef } from 'react';
import { X, Clipboard, Check, QrCode, Upload } from 'lucide-react';
import jsQR from 'jsqr';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';

const MedicationQRScanner = ({ onScanComplete, onClose }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type');
      setErrorDetails('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setUploadedImage(file);
      setError(null);
      setErrorDetails(null);
    };
    reader.readAsDataURL(file);
  };

  // Process QR code from image
  const processQRFromImage = async () => {
    if (!uploadedImage) return;

    setIsProcessingImage(true);
    setError(null);
    setErrorDetails(null);

    try {
      // Create an image element from the uploaded file
      const img = document.createElement('img');
      img.src = imagePreview;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      // Get image data for QR code processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Process the image with jsQR
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        console.log('QR code detected:', qrCode.data);
        setResult(qrCode.data);
        try {
          const parsedResult = parseQRData(qrCode.data);
          setParsedData(parsedResult);
        } catch (err) {
          console.error('Error parsing QR data:', err);
          setError('Could not parse medication data from QR code');
          setErrorDetails('The QR code was detected but the data format was not recognized. Please try scanning a valid medication QR code.');
        }
      } else {
        setError('No QR code found');
        setErrorDetails('Could not find a valid QR code in the image. Please make sure the image contains a clear QR code and try again.');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image');
      setErrorDetails('There was an error processing the image. Please make sure it is a valid image file and try again.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Parse QR code data
  const parseQRData = (data) => {
    try {
      // First try to parse as JSON
      const jsonData = JSON.parse(data);
      return {
        name: jsonData.name || jsonData.medicationName || jsonData.medication,
        dosage: jsonData.dosage || jsonData.dose || '',
        frequency: jsonData.frequency || jsonData.schedule || '',
        time: jsonData.time || jsonData.timing || '',
        startDate: jsonData.startDate || jsonData.start || new Date().toISOString(),
        endDate: jsonData.endDate || jsonData.end || null,
        manufacturingDate: jsonData.manufacturingDate || jsonData.mfgDate || null,
        expiryDate: jsonData.expiryDate || jsonData.expiry || jsonData.expirationDate || null,
        notes: jsonData.notes || jsonData.description || jsonData.additionalInfo || ''
      };
    } catch (e) {
      // If not JSON, try to parse as URL or pipe-separated format
      const parts = data.split('|');
      if (parts.length >= 3) {
        return {
          name: parts[0] || '',
          dosage: parts[1] || '',
          frequency: parts[2] || '',
          time: parts[3] || '',
          startDate: parts[4] || new Date().toISOString(),
          endDate: parts[5] || null,
          manufacturingDate: parts[6] || null,
          expiryDate: parts[7] || null,
          notes: parts[8] || 'Imported from QR code'
        };
      }
      
      // If all else fails, just return the text as medication name
      return {
        name: data,
        dosage: '',
        frequency: '',
        time: '',
        startDate: new Date().toISOString(),
        endDate: null,
        manufacturingDate: null,
        expiryDate: null,
        notes: 'Scanned from QR code'
      };
    }
  };

  // Reset image upload
  const resetImageUpload = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setError(null);
    setErrorDetails(null);
    setParsedData(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use the scanned data
  const handleUseData = () => {
    if (parsedData) {
      onScanComplete(parsedData);
    }
  };

  // Handle manual data entry
  const handleManualEntry = () => {
    onClose();
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '500px',
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        background: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <QrCode />
          Upload Medication QR Code
        </Typography>
        <IconButton onClick={onClose} color="default" size="small">
          <X />
        </IconButton>
      </Box>

      {/* Upload Area */}
      {!imagePreview && (
        <Box 
          sx={{ 
            p: 4, 
            border: '2px dashed',
            borderColor: 'primary.light',
            borderRadius: 2,
            textAlign: 'center',
            mb: 3,
            backgroundColor: 'primary.50',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <QrCode size={48} style={{ color: '#4A90E2' }} />
            <Typography color="text.secondary">
              Upload a QR code image to add medication details
            </Typography>
            <Button
              variant="contained"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<Upload />}
              sx={{ mt: 1 }}
            >
              Choose Image
            </Button>
          </Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </Box>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <img 
              src={imagePreview} 
              alt="Uploaded QR Code" 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '2px solid #4A90E2'
              }}
            />
            <IconButton
              onClick={resetImageUpload}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'error.dark',
                }
              }}
              size="small"
            >
              <X size={16} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={processQRFromImage}
              disabled={isProcessingImage}
              startIcon={<QrCode />}
              sx={{ flex: 1 }}
            >
              {isProcessingImage ? 'Processing...' : 'Process QR Code'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<Upload />}
            >
              Upload Different
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Tip: For best results, ensure the QR code is clear and well-lit in the image
          </Typography>
        </Box>
      )}

      {/* Error Messages */}
      {error && (
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'error.light',
            color: 'error.dark',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{error}</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{errorDetails}</Typography>
        </Paper>
      )}

      {/* QR Code Results */}
      {parsedData && (
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'success.light',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle1" color="success.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
            Medication Details Found
          </Typography>
          <Box sx={{ color: 'text.primary', mb: 2 }}>
            <Typography variant="body2"><strong>Name:</strong> {parsedData.name}</Typography>
            {parsedData.dosage && (
              <Typography variant="body2"><strong>Dosage:</strong> {parsedData.dosage}</Typography>
            )}
            {parsedData.frequency && (
              <Typography variant="body2"><strong>Frequency:</strong> {parsedData.frequency}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleUseData}
              startIcon={<Check />}
            >
              Use These Details
            </Button>
            <Button
              variant="outlined"
              onClick={resetImageUpload}
            >
              Upload Another
            </Button>
          </Box>
        </Paper>
      )}

      {/* Raw QR Code Result */}
      {result && !parsedData && (
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'warning.light',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle1" color="warning.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
            QR Code Detected
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 1 }}>{result}</Typography>
          <Typography variant="body2" color="warning.dark" sx={{ mb: 2 }}>
            Could not automatically parse medication data.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => {navigator.clipboard.writeText(result)}}
              startIcon={<Clipboard />}
            >
              Copy Text
            </Button>
            <Button
              variant="outlined"
              onClick={resetImageUpload}
            >
              Upload Another
            </Button>
          </Box>
        </Paper>
      )}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          color="primary"
          onClick={handleManualEntry}
          sx={{ textDecoration: 'underline' }}
        >
          Or enter medication details manually
        </Button>
      </Box>
    </Paper>
  );
};

export default MedicationQRScanner; 