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
} from '@mui/material';
import {
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BusinessUnitData } from '../types/properties';

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
};

// Create motion variants for the animations - mobile-friendly
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -100, // Reduced from -1200 to -100
    scale: 0.95
  },
  hiddenRight: {
    opacity: 0,
    x: 100, // Reduced from 1200 to 100
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  }
};

interface PropertiesProps {
  properties: BusinessUnitData[];
}

const Properties: React.FC<PropertiesProps> = ({ properties }) => {
  // State to track current image index for each property
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
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

  // Initialize image indices
  useEffect(() => {
    const initialIndices: { [key: string]: number } = {};
    properties.forEach((property) => {
      initialIndices[property.id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [properties]);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndices = { ...prev };
        properties.forEach((property) => {
          const imageCount = property.images?.length || 1;
          newIndices[property.id] = (newIndices[property.id] + 1) % imageCount;
        });
        return newIndices;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [properties]);

  // Helper function to get property location
  const getPropertyLocation = (property: BusinessUnitData): string => {
    const parts = [property.city, property.state, property.country]
      .filter(part => part && part !== 'Philippines')
      .filter(Boolean);
    return parts.join(', ');
  };

  // Helper function to get property images
  const getPropertyImages = (property: BusinessUnitData): string[] => {
    if (!property.images || property.images.length === 0) {
      return ['https://4b9moeer4y.ufs.sh/f/pUvyWRtocgCVeYTTA9NCtaEVU2mOPbBvzAkMch4GWLjTx1sZ'];
    }
    return property.images.map(img => img.image.originalUrl);
  };
  
  const getPropertyTypeDisplay = (type: string): string => {
    return type.replace('_', ' ').toLowerCase();
  };

  if (!properties || properties.length === 0) {
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
            No properties available at the moment.
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
            Hotel & Resorts
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
            Discover world-class hotels and resorts, each offering unique experiences 
            tailored to create unforgettable memories.
          </Typography>
        </Box>
      </Container>

      {/* Properties List */}
      <Box sx={{ width: '100%' }}>
        {properties.map((property, index) => {
          const isEven = index % 2 === 0;
          const propertyImages = getPropertyImages(property);
          const currentIndex = currentImageIndex[property.id] || 0;
          const location = getPropertyLocation(property);
          
          return (
            <motion.div
              key={property.id}
              initial={isMobile ? "visible" : (isEven ? "hiddenLeft" : "hiddenRight")} // No animation on mobile
              whileInView={isMobile ? "visible" : "visible"} // Always visible on mobile
              viewport={{ once: true, margin: "-20px", amount: 0.1 }} // More lenient viewport settings
              variants={cardVariants}
              transition={{
                duration: isMobile ? 0 : 0.6, // No animation duration on mobile
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween"
              }}
              style={{ 
                width: '100%',
                // Ensure visibility on mobile
                opacity: isMobile ? 1 : undefined,
                transform: isMobile ? 'none' : undefined,
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
                    '& .property-image': {
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
                    minHeight: { xs: '600px', md: '600px' },
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
                      image={propertyImages[currentIndex]}
                      alt={property.images?.[currentIndex]?.image?.altText || `${property.displayName || property.name} - Image ${currentIndex + 1}`}
                      className="property-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />

                    {/* Property Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: pitchBlackTheme.surface,
                        border: `1px solid ${pitchBlackTheme.border}`,
                        px: 3,
                        py: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: pitchBlackTheme.primaryHover,
                          borderColor: pitchBlackTheme.primaryHover,
                          '& .type-text': {
                            color: pitchBlackTheme.primary,
                          },
                        },
                      }}
                    >
                      <Typography 
                        className="type-text"
                        sx={{ 
                          fontWeight: 700,
                          color: pitchBlackTheme.text,
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          transition: 'color 0.3s ease',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        {getPropertyTypeDisplay(property.propertyType)}
                      </Typography>
                    </Box>

                    {/* Image Indicators */}
                    {propertyImages.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1,
                          zIndex: 2,
                        }}
                      >
                        {propertyImages.map((_, imgIndex: number) => (
                          <Box
                            key={imgIndex}
                            onClick={() => setCurrentImageIndex(prev => ({
                              ...prev,
                              [property.id]: imgIndex
                            }))}
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: imgIndex === currentIndex 
                                ? pitchBlackTheme.text 
                                : pitchBlackTheme.textSecondary,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: pitchBlackTheme.text,
                                transform: 'scale(1.2)',
                              },
                            }}
                          />
                        ))}
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
                      
                      {/* Location */}
                      {location && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 4,
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                          flexWrap: 'wrap',
                          gap: 1,
                        }}>
                          <LocationOn sx={{ 
                            color: pitchBlackTheme.textSecondary,
                            fontSize: 20,
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
                            {location}
                          </Typography>
                        </Box>
                      )}
                      
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
                        {property.shortDescription || property.description || 'Experience luxury and comfort in this exceptional property.'}
                      </Typography>

                      {/* Explore Button */}
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
                          href={`/properties/${property.slug}`}
                          component="a"
                        >
                          Explore Property
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
            Ready for your next
            <br />
            luxury experience?
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
            component="a"
            href="/reservations"
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
            Book Your Experience
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Properties;