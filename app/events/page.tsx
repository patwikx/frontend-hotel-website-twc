// app/events/page.tsx

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { getPublishedEventsLessRestrictive } from '@/lib/actions/events';
import EventCards from './components/events-card';


const pitchBlackTheme = {
  background: '#000000',
  text: '#ffffff',
  textSecondary: '#6b7280',
};

const EventsPage: React.FC = async () => {
  const events = await getPublishedEventsLessRestrictive();

  return (
    <Box sx={{ backgroundColor: pitchBlackTheme.background, color: pitchBlackTheme.text, minHeight: '100vh' }}>
      {/* Header Section (can remain a server component) */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 16 }, pb: { xs: 6, md: 12 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2,
            }}
          >
            Premium Hospitality
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              color: pitchBlackTheme.text,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: { xs: 1.1, md: 1.1 },
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              mb: 4,
            }}
          >
            All Events
          </Typography>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Discover all our upcoming events and experiences across our premium properties.
            From intimate gatherings to grand celebrations.
          </Typography>
        </Box>
      </Container>

      {/* Events Grid - This part is now a client component */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 16 } }}>
        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: pitchBlackTheme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              No events scheduled at this time
            </Typography>
            <Typography sx={{ color: pitchBlackTheme.textSecondary, mt: 2 }}>
              Check back soon for exciting upcoming events and experiences.
            </Typography>
          </Box>
        ) : (
          // Use the new client component here and pass the fetched data
          <EventCards events={events} />
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;