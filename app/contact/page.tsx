import React from 'react';
import { Box } from '@mui/material';
import { getContactLocations } from '@/lib/actions/contact';
import ContactContent from './components/contac-content';


const ContactPage: React.FC = async () => {
  const locations = await getContactLocations();

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <ContactContent locations={locations} />
    </Box>
  );
};

export default ContactPage;