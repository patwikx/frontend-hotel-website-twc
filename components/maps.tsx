'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { LocationOn, Phone, Email, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BusinessUnitData, getBusinessUnits } from '@/lib/actions/business-units';

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
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',
  errorHover: '#b91c1c',
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

const Maps: React.FC = () => {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        setLoading(true);
        const units = await getBusinessUnits();
        setBusinessUnits(units);
      } catch (err) {
        console.error('Error fetching business units:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  // Generate Google Maps Static API URL
  const generateMapUrl = (lat: number | null, lng: number | null, name: string): string => {
    if (!lat || !lng) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(name)}&zoom=13&size=600x450&markers=color:red%7C${encodeURIComponent(name)}&key=YOUR_API_KEY`;
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=600x450&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
  };

  // Generate email from property name
  const generateEmail = (name: string): string => {
    return `info@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`;
  };

  // Extract amenities from property
  const getAmenities = (property: BusinessUnitData): string[] => {
    const amenities = [];
    
    if (property._count.rooms > 0) {
      amenities.push(`${property._count.rooms} Rooms`);
    }
    if (property._count.restaurants > 0) {
      amenities.push(`${property._count.restaurants} Restaurants`);
    }
    if (property._count.specialOffers > 0) {
      amenities.push('Special Offers');
    }
    if (property._count.events > 0) {
      amenities.push('Events');
    }
    
    // Add some default amenities based on property type
    switch (property.propertyType) {
      case 'HOTEL':
        amenities.push('Luxury Suites', 'Spa', 'Pool');
        break;
      case 'RESORT':
        amenities.push('Beach Access', 'Golf Course', 'Wellness Center');
        break;
      default:
        amenities.push('Premium Service', 'Concierge', 'Valet');
    }
    
    return amenities.slice(0, 3);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          py: 16,
          backgroundColor: pitchBlackTheme.background,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress size={60} sx={{ color: pitchBlackTheme.text }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          py: 16,
          backgroundColor: pitchBlackTheme.background,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            sx={{ 
              color: pitchBlackTheme.error, 
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Error Loading Properties
          </Typography>
          <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
            {error}
          </Typography>
        </Container>
      </Box>
    );
  }

  if (businessUnits.length === 0) {
    return (
      <Box 
        sx={{ 
          py: 16,
          backgroundColor: pitchBlackTheme.background,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            sx={{ 
              color: pitchBlackTheme.text, 
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            No Properties Available
          </Typography>
          <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
            Please check back later for our property listings.
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
            Find Our
            <br />
            Properties
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
            Discover our luxurious properties across prime locations. Each destination offers
            unique experiences and world-class amenities.
          </Typography>
        </Box>
      </Container>

      {/* Properties List */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 6, md: 8 },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {businessUnits.map((property, index) => {
            const isEven = index % 2 === 0;
            const amenities = getAmenities(property);
            const location = `${property.city}${property.state ? ', ' + property.state : ''}, ${property.country}`;
            
            return (
              <motion.div
                key={property.id}
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
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${pitchBlackTheme.border}`,
                    // Ensure card is visible and animated properly
                    opacity: 1,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                      borderColor: pitchBlackTheme.text,
                      '& .map-overlay': {
                        opacity: 0.7,
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
                      minHeight: { xs: 'auto', md: '500px' },
                      width: '100%',
                    }}
                  >
                    {/* Map Section */}
                    <Box 
                      sx={{ 
                        flex: { xs: '1', md: '0 0 50%' },
                        position: 'relative',
                        overflow: 'hidden',
                        height: { xs: '400px', md: '500px' },
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${generateMapUrl(property.latitude, property.longitude, `${property.name}, ${location}`)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: pitchBlackTheme.surfaceHover,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Map Overlay */}
                        <Box
                          className="map-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: `${pitchBlackTheme.surfaceHover}cc`,
                            transition: 'opacity 0.3s ease',
                          }}
                        />
                        
                        {/* Location Indicator */}
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: 2,
                            backgroundColor: pitchBlackTheme.surface,
                            border: `1px solid ${pitchBlackTheme.border}`,
                            color: pitchBlackTheme.text,
                            p: 4,
                            textAlign: 'center',
                            maxWidth: '300px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: pitchBlackTheme.primaryHover,
                              borderColor: pitchBlackTheme.primaryHover,
                              '& .location-name': {
                                color: pitchBlackTheme.primary,
                              },
                              '& .location-address': {
                                color: pitchBlackTheme.primary,
                              },
                            },
                          }}
                        >
                          <LocationOn sx={{ 
                            fontSize: 40, 
                            mb: 2, 
                            color: pitchBlackTheme.textSecondary,
                            transition: 'color 0.3s ease',
                          }} />
                          <Typography 
                            className="location-name"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '1.25rem',
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              color: pitchBlackTheme.text,
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              transition: 'color 0.3s ease',
                            }}
                          >
                            {property.displayName || property.name}
                          </Typography>
                          <Typography 
                            className="location-address"
                            sx={{ 
                              color: pitchBlackTheme.textSecondary, 
                              fontWeight: 500,
                              transition: 'color 0.3s ease',
                            }}
                          >
                            {location}
                          </Typography>
                        </Box>
                      </Box>
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
                        {/* Property Name */}
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
                          {property.displayName || property.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          sx={{
                            color: pitchBlackTheme.textSecondary,
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            lineHeight: 1.6,
                            mb: 5,
                            fontWeight: 400,
                            maxWidth: { xs: '100%', md: '400px' },
                            mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                            ml: { md: isEven ? '0' : 'auto' },
                          }}
                        >
                          {property.shortDescription || property.description || `Experience luxury and comfort at ${property.displayName || property.name}.`}
                        </Typography>

                        {/* Amenities */}
                        {amenities.length > 0 && (
                          <Box sx={{ mb: 5 }}>
                            <Typography 
                              sx={{ 
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: pitchBlackTheme.text,
                                mb: 3,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                              }}
                            >
                              Key Amenities
                            </Typography>
                            <Stack 
                              direction="row" 
                              spacing={2} 
                              sx={{ 
                                flexWrap: 'wrap', 
                                gap: 2,
                                justifyContent: { 
                                  xs: 'center', 
                                  md: isEven ? 'flex-start' : 'flex-end' 
                                },
                              }}
                            >
                              {amenities.map((amenity) => (
                                <Chip
                                  key={amenity}
                                  label={amenity}
                                  sx={{
                                    backgroundColor: pitchBlackTheme.surfaceHover,
                                    color: pitchBlackTheme.text,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    borderRadius: 0,
                                    height: 32,
                                    border: `1px solid ${pitchBlackTheme.border}`,
                                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: pitchBlackTheme.primaryHover,
                                      borderColor: pitchBlackTheme.primaryHover,
                                      color: pitchBlackTheme.primary,
                                    },
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Contact Info */}
                        <Box sx={{ mb: 6 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: pitchBlackTheme.text,
                              mb: 3,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            Contact Information
                          </Typography>
                          <Stack 
                            spacing={2}
                            sx={{
                              alignItems: { 
                                xs: 'center', 
                                md: isEven ? 'flex-start' : 'flex-end' 
                              },
                            }}
                          >
                            {/* Address */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                              gap: 1,
                            }}>
                              <LocationOn sx={{ 
                                color: pitchBlackTheme.textSecondary,
                                fontSize: 20,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: pitchBlackTheme.textSecondary,
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {property.address || location}
                              </Typography>
                            </Box>
                            
                            {/* Phone */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                              gap: 1,
                            }}>
                              <Phone sx={{ 
                                color: pitchBlackTheme.textSecondary,
                                fontSize: 20,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: pitchBlackTheme.textSecondary,
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {property.phone || '+1 (555) 123-4567'}
                              </Typography>
                            </Box>
                            
                            {/* Email */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              flexDirection: { xs: 'row', md: isEven ? 'row' : 'row-reverse' },
                              gap: 1,
                            }}>
                              <Email sx={{ 
                                color: pitchBlackTheme.textSecondary,
                                fontSize: 20,
                              }} />
                              <Typography 
                                sx={{ 
                                  color: pitchBlackTheme.textSecondary,
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {property.email || generateEmail(property.name)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {/* Get Directions Button */}
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
                            onClick={() => {
                              if (property.latitude && property.longitude) {
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
                                  '_blank'
                                );
                              } else {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.name}, ${location}`)}`,
                                  '_blank'
                                );
                              }
                            }}
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
                          >
                            Get Directions
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
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: { xs: 12, md: 20 },
            py: { xs: 6, md: 8 },
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
            Ready to visit
            <br />
            our locations?
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
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
            Plan Your Visit
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Maps;