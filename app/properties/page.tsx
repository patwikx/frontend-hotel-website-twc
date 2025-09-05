import React from 'react';
import { Box } from '@mui/material';
import { getBusinessUnits } from '@/lib/actions/business-units';
import PropertiesContent from './components/properties-content';


const PropertiesPage: React.FC = async () => {
  const properties = await getBusinessUnits();

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <PropertiesContent properties={properties} />
    </Box>
  );
};

export default PropertiesPage;