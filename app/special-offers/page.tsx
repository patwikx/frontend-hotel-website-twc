import React from 'react';
import { Box } from '@mui/material';
import { getAllSpecialOffers } from '@/lib/cms-actions/special-offer';
import OffersContent from './components/offers-content';


const OffersPage: React.FC = async () => {
  const offers = await getAllSpecialOffers();

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <OffersContent offers={offers} />
    </Box>
  );
};

export default OffersPage;