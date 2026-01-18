import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';

const BarcodeScanner = ({ onScanSuccess, onScanFailure }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only initialize scanner if not already rendered
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    const successCallback = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      scanner.clear(); // Stop scanning after success
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    };

    const errorCallback = (errorMessage) => {
      // Handle too many errors (ignoring for now as it triggers on every frame without code)
      // console.warn(errorMessage);
        if(onScanFailure) onScanFailure(errorMessage);
    };

    scanner.render(successCallback, errorCallback);

    // Cleanup function
    return () => {
      scanner.clear().catch(error => {
          // Failed to clear scanner.
          console.error("Failed to clear html5-qrcode scanner. ", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  const handleReset = () => {
      setScanResult(null);
      setError(null);
      // Re-mount component to restart scanner is a simple way, 
      // or we can handle restart logic if we expose it. 
      // For now, simpler to let parent handle reset by unmounting/remounting 
      // or just refresh.
      window.location.reload(); 
  }

  return (
    <Box sx={{ maxWidth: '500px', margin: 'auto', textAlign: 'center', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Scan Product Barcode
      </Typography>
      
      {!scanResult ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
             <div id="reader" width="100%"></div>
        </Paper>
      ) : (
        <Alert severity="success" sx={{ mb: 2 }}>
          Scanned Code: <strong>{scanResult}</strong>
        </Alert>
      )}

      {scanResult && (
        <Button variant="contained" onClick={handleReset}>
          Scan Again
        </Button>
      )}
    </Box>
  );
};

export default BarcodeScanner;
