import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const handleSearch = async () => {
    if (vin.length !== 17) {
      setError('VIN must be 17 characters long');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/carinfo?vin=${vin}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch car information');
      }
  
      // Format the data for display
      const formattedData = {
        make: data.make || 'N/A',
        model: data.model || 'N/A',
        year: data.year || 'N/A',
        vin: data.vin || 'N/A',
        junk_and_salvage: data.junk_and_salvage || [],
        insurance_info: data.insurance_info || [],
        brand_info: data.brand_info || []
      };
  
      setCarData(formattedData);
    } catch (err) {
      setError(err.message);
      setCarData(null);
    } finally {
      setLoading(false);
    }
  };

const ResearchCars = () => {
  const [vin, setVin] = useState('');
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVinChange = (event) => {
    const input = event.target.value.toUpperCase();
    setVin(input);
    setError(null);
  };

  const handleSearch = async () => {
    if (vin.length !== 17) {
      setError('VIN must be 17 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/carinfo?vin=${vin}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch car information');
      }

      setCarData(data);
    } catch (err) {
      setError(err.message);
      setCarData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderRecordList = (records, title) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {records.map((record, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>
              <strong>Reporting Entity:</strong> {record.reporting_entity}
            </Typography>
            <Typography>
              <strong>Location:</strong> {record.location}
            </Typography>
            <Typography>
              <strong>Date:</strong> {record.date}
            </Typography>
            <Typography>
              <strong>Disposition:</strong> {record.disposition}
            </Typography>
            {index < records.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      {/* Image */}
      <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', justifyContent: 'center' }}>
        <img src="/detective.jpg" alt="Description of the image" style={{ maxWidth: '70%', height: 'auto' }} />
      </Box>
      {/* Heading */}
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
        Vehicle History Lookup: Drivewise Detective
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
        Welcome to <strong>Drivewise Detective</strong>, your trusty sidekick for uncovering a vehicle's hidden past! Enter a 17-digit Vehicle Identification Number (VIN) below to reveal its history—junk records, salvage tales, insurance info, and more. Let's solve the mystery of your ride!
      </Typography>

      {/* Search Form */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          label="VIN Number"
          variant="outlined"
          value={vin}
          onChange={handleVinChange}
          error={error !== null}
          helperText={error || 'Enter a 17-digit VIN number'}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || vin.length !== 17}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ height: '56px', minWidth: '120px' }}
        >
          Search
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Vehicle Information Card */}
      {carData && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Vehicle Information
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography>
                <strong>VIN:</strong> {carData.vin}
              </Typography>

              {/* Junk and Salvage Records */}
              {carData.junk_and_salvage.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Junk and Salvage Records
                  </Typography>
                  {carData.junk_and_salvage.map((record, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography>
                        <strong>Reporting Entity:</strong> {record.reporting_entity}
                      </Typography>
                      <Typography>
                        <strong>Location:</strong> {record.location}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {record.date}
                      </Typography>
                      <Typography>
                        <strong>Disposition:</strong> {record.disposition}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Insurance Records */}
              {carData.insurance_info.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Insurance Records
                  </Typography>
                  {carData.insurance_info.map((record, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography>
                        <strong>Company:</strong> {record.company}
                      </Typography>
                      <Typography>
                        <strong>Location:</strong> {record.location}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {record.date}
                      </Typography>
                      <Typography>
                        <strong>Disposition:</strong> {record.disposition}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ResearchCars;


