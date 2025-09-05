"use client";

import React from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { LocationOn, ArrowForward, Hotel, Bed, Restaurant } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getBusinessUnits } from '@/lib/actions/business-units';

// This is a Client Component, marked with "use client".
// It can use client-side libraries like framer-motion.

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

// Define a type for the properties data passed as a prop
interface PropertiesContentProps {
  properties: Awaited<ReturnType<typeof getBusinessUnits>>;
}

const PropertiesContent: React.FC<PropertiesContentProps> = ({ properties }) => {
  const getPropertyLocation = (property: typeof properties[0]): string => {
    const parts = [property.city, property.state, property.country]
      .filter(part => part && part !== 'Philippines')
      .filter(Boolean);
    return parts.join(', ');
  };

  const getPropertyImages = (property: typeof properties[0]): string[] => {
    if (!property.images || property.images.length === 0) {
      return ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'];
    }
    return property.images.map(img => img.image.originalUrl);
  };
  
  const getPropertyTypeDisplay = (type: string): string => {
    return type.replace('_', ' ').toLowerCase();
  };

  const getPrimaryImage = (property: typeof properties[0]): string => {
    const images = getPropertyImages(property);
    return images[0];
  };

  return (
    <>
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
            All Properties
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
            Explore our complete collection of luxury hotels and resorts. Each property offers
            unique experiences and world-class amenities in stunning locations.
          </Typography>
        </Box>
      </Container>

      {/* Properties Grid */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 16 } }}>
        {properties.length === 0 ? (
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
              No properties available at this time
            </Typography>
            <Typography sx={{ color: pitchBlackTheme.textSecondary, mt: 2 }}>
              Check back soon for our luxury hotel and resort listings.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)'
              },
              gap: 6,
            }}
          >
            {properties.map((property, index) => {
              const location = getPropertyLocation(property);
              const primaryImage = getPrimaryImage(property);
              
              return (
                <motion.div
                  key={property.id}
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
                        '& .property-image': {
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
                        alt={property.images?.[0]?.image?.altText || `${property.displayName || property.name} exterior`}
                        className="property-image"
                        sx={{
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                      
                      {/* Property Type Badge */}
                      <Chip
                        label={getPropertyTypeDisplay(property.propertyType)}
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
                        }}
                      >
                        {property.displayName || property.name}
                      </Typography>

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocationOn sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary, mr: 1 }} />
                        <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                          {location}
                        </Typography>
                      </Box>

                      {/* Property Stats */}
                      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Bed sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary }} />
                          <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                            {property._count.rooms} rooms
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Restaurant sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary }} />
                          <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                            {property._count.restaurants} restaurants
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Hotel sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary }} />
                          <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                            {property._count.events} events
                          </Typography>
                        </Box>
                      </Box>

                      {/* Corrected: Removed flex: 1 from this Typography component to prevent it from pushing the button out of view */}
                      <Typography
                        sx={{
                          color: pitchBlackTheme.textSecondary,
                          mb: 3,
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {property.shortDescription || property.description || 'Experience luxury and comfort in this exceptional property.'}
                      </Typography>

                      {/* The "View Property" button will now be visible below the description */}
                      {property.slug && (
                        <Button
                          fullWidth
                          endIcon={<ArrowForward />}
                          href={`/properties/${property.slug}`}
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
                          View Property
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </>
  );
};

export default PropertiesContent;