// components/EventCards.tsx
'use client';

import React from 'react';
import { Box, Typography, Card, CardMedia, Button, Chip, CardContent } from '@mui/material';
import { CalendarToday, LocationOn, ArrowForward, People, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion'; // This will now work correctly

// Re-declare your types to ensure they are available in this file
interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string | null;
  endTime: string | null;
  venue: string;
  isFree: boolean;
  ticketPrice: number | null;
  currency: string;
  requiresBooking: boolean;
  maxAttendees: number | null;
  images: {
    isPrimary: boolean;
    image: {
      mediumUrl: string | null;
      originalUrl: string;
      altText: string | null;
    } | null;
  }[];
}

const pitchBlackTheme = {
  background: '#000000',
  surface: '#000000',
  surfaceHover: '#111111',
  primary: '#000000',
  primaryHover: '#ffffff',
  text: '#ffffff',
  textSecondary: '#6b7280',
  border: '#1a1a1a',
  selected: '#ffffff',
  selectedBg: 'rgba(255, 255, 255, 0.08)',
  shadow: 'rgba(255, 255, 255, 0.1)',
  shadowMedium: 'rgba(255, 255, 255, 0.15)',
  success: '#10b981',
  successText: '#ffffff',
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getPrimaryImage = (images: EventData['images']) => {
  const primaryImage = images.find(img => img.isPrimary);
  const fallbackImage = images[0];
  const imageToUse = primaryImage || fallbackImage;

  return imageToUse?.image?.mediumUrl || 
         imageToUse?.image?.originalUrl || 
         'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800';
};

const getEventTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    'WEDDING': 'Wedding',
    'CONFERENCE': 'Conference',
    'MEETING': 'Meeting',
    'WORKSHOP': 'Workshop',
    'CELEBRATION': 'Celebration',
    'CULTURAL': 'Cultural',
    'SEASONAL': 'Seasonal',
    'ENTERTAINMENT': 'Entertainment',
    'CORPORATE': 'Corporate',
    'PRIVATE': 'Private Event'
  };
  return typeMap[type] || type;
};

const formatPrice = (price: number | null, currency: string, isFree: boolean): string => {
  if (isFree) return 'Free';
  if (!price) return 'Contact for pricing';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(price);
};

interface EventCardsProps {
    events: EventData[];
}

const EventCards: React.FC<EventCardsProps> = ({ events }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: 4,
      }}
    >
      {events.map((event, index) => {
        const primaryImage = getPrimaryImage(event.images);

        return (
          <motion.div
            key={event.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                  borderColor: pitchBlackTheme.text,
                  '& .event-image': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={primaryImage}
                  alt={event.images[0]?.image?.altText || event.title}
                  className="event-image"
                  sx={{
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />

                {/* Event Type Badge */}
                <Chip
                  label={getEventTypeDisplay(event.type)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: pitchBlackTheme.surface,
                    color: pitchBlackTheme.text,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: `1px solid ${pitchBlackTheme.border}`,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                />

                {/* Price Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    backgroundColor: event.isFree ? pitchBlackTheme.success : pitchBlackTheme.surface,
                    border: `1px solid ${pitchBlackTheme.border}`,
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: event.isFree ? pitchBlackTheme.successText : pitchBlackTheme.text,
                  }}
                >
                  {formatPrice(event.ticketPrice, event.currency, event.isFree)}
                </Box>
              </Box>

              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: pitchBlackTheme.text,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    lineHeight: 1.2,
                  }}
                >
                  {event.title}
                </Typography>

                {/* Event Details */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                      {formatDate(event.startDate)}
                    </Typography>
                  </Box>

                  {event.startTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                        {formatTime(event.startTime)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                      {event.venue}
                    </Typography>
                  </Box>

                  {event.maxAttendees && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                        Max {event.maxAttendees} attendees
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Typography
                  sx={{
                    color: pitchBlackTheme.textSecondary,
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    flex: 1,
                  }}
                >
                  {event.shortDesc || event.description.substring(0, 150) + '...'}
                </Typography>

                <Button
                  fullWidth
                  endIcon={<ArrowForward />}
                  href={`/events/${event.slug}`}
                  sx={{
                    backgroundColor: pitchBlackTheme.primary,
                    color: pitchBlackTheme.text,
                    border: `2px solid ${pitchBlackTheme.text}`,
                    py: 1.5,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    borderRadius: 0,
                    fontFamily: '"Arial Black", "Helvetica", sans-serif',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: pitchBlackTheme.primaryHover,
                      borderColor: pitchBlackTheme.primaryHover,
                      color: pitchBlackTheme.primary,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {event.requiresBooking ? 'Reserve Spot' : 'Learn More'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default EventCards;