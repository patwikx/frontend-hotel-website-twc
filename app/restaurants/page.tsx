import React from 'react';
import { Box } from '@mui/material';
import { getPublishedRestaurants } from '@/lib/actions/restaurants';
import RestaurantsContent from './components/restaurant-content';


const RestaurantsPage: React.FC = async () => {
  const restaurants = await getPublishedRestaurants();

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <RestaurantsContent restaurants={restaurants} />
    </Box>
  );
};

export default RestaurantsPage;