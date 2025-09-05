import React from 'react';
import { Box } from '@mui/material';
import { getAboutData, getTeamMembers } from '@/lib/actions/about';
import AboutContent from './components/about-card';

const AboutPage: React.FC = async () => {
  const [aboutData, teamMembers] = await Promise.all([
    getAboutData(),
    getTeamMembers(),
  ]);

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <AboutContent aboutData={aboutData} teamMembers={teamMembers} />
    </Box>
  );
};

export default AboutPage;