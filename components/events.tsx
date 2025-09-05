'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { CalendarToday, LocationOn, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { EventData } from '@/lib/actions/events';

interface EventsProps {
  events: EventData[];
}

// Pitch black theme with white hover effects
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

// Create motion variants for the animations - mobile-friendly
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -100,
    scale: 0.95
  },
  hiddenRight: {
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  hiddenMobile: {
    opacity: 0,
    y: 50, // Slide up from bottom on mobile
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1
  }
};

const Events: React.FC<EventsProps> = ({ events }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Show message if no events
  if (!events || events.length === 0) {
    return (
      <Box sx={{ 
        py: { xs: 8, md: 16 }, 
        textAlign: 'center', 
        backgroundColor: pitchBlackTheme.background, 
        color: pitchBlackTheme.text,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container maxWidth="xl">
          <Typography 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: pitchBlackTheme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            No upcoming events at this time.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: pitchBlackTheme.background,
        position: 'relative',
        color: pitchBlackTheme.text,
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // Prevent horizontal scroll on mobile
      }}
    >
      {/* Header Section */}
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
              whiteSpace: 'nowrap',
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
            Upcoming Events
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
            Join us for exclusive events and experiences across our premium properties.
            Create memories that last a lifetime.
          </Typography>
        </Box>
      </Container>

      {/* Events List */}
      <Box sx={{ width: '100%' }}>
        {events.map((event, index) => {
          const isEven = index % 2 === 0;
          const primaryImage = getPrimaryImage(event.images);
          
          return (
            <motion.div
              key={event.id}
              initial={isMobile ? "hiddenMobile" : (isEven ? "hiddenLeft" : "hiddenRight")} // Slide up on mobile, left/right on desktop
              whileInView="visible"
              viewport={{ once: true, margin: "-50px", amount: 0.2 }}
              variants={cardVariants}
              transition={{
                duration: isMobile ? 0.5 : 0.7, // Slightly faster on mobile
                ease: isMobile ? [0.4, 0, 0.2, 1] : [0.25, 0.1, 0.25, 1], // Different easing for mobile
                type: "tween"
              }}
              style={{ 
                width: '100%',
              }}
            >
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  borderRadius: 0,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  width: '100%',
                  mb: 0,
                  // Ensure card is visible and animated properly
                  opacity: 1,
                  '&:hover': {
                    '& .event-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { 
                      xs: 'column', 
                      md: isEven ? 'row' : 'row-reverse' 
                    },
                    minHeight: { xs: 'auto', md: '600px' },
                    width: '100%',
                  }}
                >
                  {/* Image Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      position: 'relative',
                      overflow: 'hidden',
                      height: { xs: '400px', md: 'auto' },
                      minHeight: { xs: '400px', md: '100%' },
                      width: '100%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={primaryImage}
                      alt={event.images[0]?.image?.altText || event.title}
                      className="event-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    
                    {/* Date Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: pitchBlackTheme.surface,
                        border: `1px solid ${pitchBlackTheme.border}`,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '60px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: pitchBlackTheme.primaryHover,
                          borderColor: pitchBlackTheme.primaryHover,
                          '& .date-number': {
                            color: pitchBlackTheme.primary,
                          },
                          '& .date-month': {
                            color: pitchBlackTheme.primary,
                          },
                        },
                      }}
                    >
                      <Typography 
                        className="date-number"
                        sx={{ 
                          fontWeight: 900,
                          color: pitchBlackTheme.text,
                          fontSize: '1.5rem',
                          lineHeight: 1,
                          mb: 0.5,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {event.startDate.getDate()}
                      </Typography>
                      <Typography 
                        className="date-month"
                        sx={{ 
                          fontWeight: 700,
                          color: pitchBlackTheme.textSecondary,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          lineHeight: 1,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {event.startDate.toLocaleDateString('en-US', { month: 'short' })}
                      </Typography>
                    </Box>

                    {/* Price Badge */}
                    {(event.isFree || event.ticketPrice) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 24,
                          [isEven ? 'right' : 'left']: 24,
                          backgroundColor: event.isFree ? pitchBlackTheme.success : pitchBlackTheme.surface,
                          border: `1px solid ${pitchBlackTheme.border}`,
                          px: 3,
                          py: 1.5,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: pitchBlackTheme.primaryHover,
                            borderColor: pitchBlackTheme.primaryHover,
                            '& .price-text': {
                              color: pitchBlackTheme.primary,
                            },
                          },
                        }}
                      >
                        <Typography
                          className="price-text"
                          sx={{
                            color: event.isFree ? pitchBlackTheme.successText : pitchBlackTheme.text,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'color 0.3s ease',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          {formatPrice(event.ticketPrice, event.currency, event.isFree)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Content Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: { xs: 4, md: 6, lg: 8 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                        width: '100%',
                      }}
                    >
                      {/* Event Number & Business Unit */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: pitchBlackTheme.textSecondary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            display: 'block',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          Event {String(index + 1).padStart(2, '0')}
                        </Typography>
                        {event.businessUnit && (
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: pitchBlackTheme.text,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              mt: 0.5,
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {event.businessUnit.displayName}
                          </Typography>
                        )}
                      </Box>

                      {/* Event Title */}
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                          color: pitchBlackTheme.text,
                          mb: 3,
                          letterSpacing: '0.02em',
                          lineHeight: 1.1,
                          textTransform: 'uppercase',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {event.title}
                      </Typography>

                      {/* Event Details */}
                      <Stack 
                        spacing={2} 
                        sx={{ 
                          mb: 4,
                          alignItems: { xs: 'center', md: isEven ? 'flex-start' : 'flex-end' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <CalendarToday sx={{ 
                            color: pitchBlackTheme.textSecondary, 
                            fontSize: 20 
                          }} />
                          <Typography 
                            sx={{ 
                              color: pitchBlackTheme.textSecondary,
                              fontWeight: 600,
                              fontSize: '1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {formatDate(event.startDate)}
                            {event.startTime && ` • ${formatTime(event.startTime)}`}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <LocationOn sx={{ 
                            color: pitchBlackTheme.textSecondary, 
                            fontSize: 20 
                          }} />
                          <Typography 
                            sx={{ 
                              color: pitchBlackTheme.textSecondary,
                              fontWeight: 600,
                              fontSize: '1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {event.venue}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Description */}
                      <Typography
                        sx={{
                          color: pitchBlackTheme.textSecondary,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          lineHeight: 1.6,
                          mb: 5,
                          fontWeight: 400,
                          maxWidth: { xs: '100%', md: '500px' },
                          mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                          ml: { md: isEven ? '0' : 'auto' },
                        }}
                      >
                        {event.shortDesc || event.description.substring(0, 200) + '...'}
                      </Typography>

                      {/* Event Type/Category */}
                      <Box sx={{ mb: 5 }}>
                        <Typography 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: pitchBlackTheme.textSecondary,
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            display: 'block',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          }}
                        >
                          Event Details
                        </Typography>
                        <Stack 
                          direction="row" 
                          spacing={3} 
                          sx={{ 
                            flexWrap: 'wrap', 
                            gap: 2,
                            justifyContent: { 
                              xs: 'center', 
                              md: isEven ? 'flex-start' : 'flex-end' 
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.95rem',
                              color: pitchBlackTheme.textSecondary,
                              fontWeight: 500,
                              position: 'relative',
                              '&::before': {
                                content: '"•"',
                                color: pitchBlackTheme.text,
                                fontWeight: 700,
                                mr: 1,
                              }
                            }}
                          >
                            {getEventTypeDisplay(event.type)}
                          </Typography>
                          {event.maxAttendees && (
                            <Typography
                              sx={{
                                fontSize: '0.95rem',
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 500,
                                position: 'relative',
                                '&::before': {
                                  content: '"•"',
                                  color: pitchBlackTheme.text,
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              Max {event.maxAttendees} Attendees
                            </Typography>
                          )}
                          {event.requiresBooking && (
                            <Typography
                              sx={{
                                fontSize: '0.95rem',
                                color: pitchBlackTheme.textSecondary,
                                fontWeight: 500,
                                position: 'relative',
                                '&::before': {
                                  content: '"•"',
                                  color: pitchBlackTheme.text,
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              Booking Required
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      {/* Reserve Spot Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                        }}
                      >
                        <Button
                          endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
                          sx={{
                            backgroundColor: pitchBlackTheme.primary,
                            color: pitchBlackTheme.text,
                            border: `2px solid ${pitchBlackTheme.text}`,
                            px: 5,
                            py: 2.5,
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            borderRadius: 0,
                            minWidth: '160px',
                            fontFamily: '"Arial Black", "Helvetica", sans-serif',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: pitchBlackTheme.primaryHover,
                              borderColor: pitchBlackTheme.primaryHover,
                              color: pitchBlackTheme.primary,
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${pitchBlackTheme.selectedBg}`,
                              '& .MuiSvgIcon-root': {
                                color: pitchBlackTheme.primary,
                              },
                            },
                          }}
                          href={`/events/${event.slug}`}
                          component="a"
                        >
                          {event.requiresBooking ? 'Reserve Spot' : 'Learn More'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Bottom CTA Section */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 8, md: 12 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: pitchBlackTheme.text,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 0.9,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Don&apos;t miss out on
            <br />
            exclusive experiences
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
            component="a"
            href="/events"
            sx={{
              backgroundColor: pitchBlackTheme.primary,
              color: pitchBlackTheme.text,
              border: `2px solid ${pitchBlackTheme.text}`,
              px: 10,
              py: 3.5,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              mt: 4,
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: pitchBlackTheme.primaryHover,
                borderColor: pitchBlackTheme.primaryHover,
                color: pitchBlackTheme.primary,
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 24px ${pitchBlackTheme.selectedBg}`,
                '& .MuiSvgIcon-root': {
                  color: pitchBlackTheme.primary,
                },
              },
            }}
          >
            View All Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Events;