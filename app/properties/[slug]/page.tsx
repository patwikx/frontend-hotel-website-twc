import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, Chip } from '@mui/material';
import { LocationOn, Phone, Email, ArrowForward, Bed, People } from '@mui/icons-material';
import Link from 'next/link';
import { getPropertyWithRooms } from '@/lib/room-details';

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
  accent: '#3b82f6',
};

interface PropertyPageProps {
  params: { slug: string };
}

const PropertyPage: React.FC<PropertyPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  const property = await getPropertyWithRooms(slug);

  if (!property) {
    notFound();
  }

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const getPropertyTypeDisplay = (type: string): string => {
    return type.replace('_', ' ').toLowerCase();
  };

  const primaryImage = property.images.find(img => img.isPrimary)?.image.originalUrl ||
                     property.images[0]?.image.originalUrl || 
                     'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920';

  return (
    <Box sx={{ backgroundColor: pitchBlackTheme.background, color: pitchBlackTheme.text, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          backgroundImage: `url(${primaryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '800px' }}>
            <Chip
              label={getPropertyTypeDisplay(property.propertyType)}
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                color: pitchBlackTheme.text,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                mb: 3,
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
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                color: 'white',
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 0.9,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {property.displayName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOn sx={{ color: 'white', mr: 1, fontSize: 24 }} />
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {property.city}, {property.country}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 'white',
                fontSize: '1.25rem',
                lineHeight: 1.6,
                mb: 6,
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {property.shortDescription || property.description}
            </Typography>
            <Button
              endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
              sx={{
                backgroundColor: pitchBlackTheme.primary,
                color: pitchBlackTheme.text,
                border: `2px solid ${pitchBlackTheme.text}`,
                px: 6,
                py: 3,
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderRadius: 0,
                fontFamily: '"Arial Black", "Helvetica", sans-serif',
                transition: 'all 0.2s ease',
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
              Book Your Stay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Property Details */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        {/* Property Gallery */}
        {property.images.length > 1 && (
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: pitchBlackTheme.text,
                mb: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Property Gallery
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 4,
              }}
            >
              {property.images.slice(1, 7).map((imageRelation) => (
                <Box
                  key={imageRelation.id}
                  sx={{
                    position: 'relative',
                    height: 250,
                    borderRadius: 0,
                    overflow: 'hidden',
                    backgroundImage: `url(${imageRelation.image.originalUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${pitchBlackTheme.border}`,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: pitchBlackTheme.text,
                      boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
                    },
                  }}
                >
                  {imageRelation.image.title && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        }}
                      >
                        {imageRelation.image.title}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Room Types Section */}
        {property.roomTypes.length > 0 && (
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: pitchBlackTheme.text,
                mb: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Our Rooms & Suites
            </Typography>
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
              {property.roomTypes.map((roomType) => (
                <Card
                  key={roomType.id}
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
                    },
                  }}
                >
                  {roomType.images.length > 0 && (
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(${roomType.images[0].image.originalUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: pitchBlackTheme.accent,
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(roomType.baseRate, roomType.currency)}
                      </Box>
                    </Box>
                  )}
                  <CardContent sx={{ p: 3 }}>
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
                      {roomType.displayName}
                    </Typography>
                    
                    {/* Room Stats */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary }} />
                        <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                          {roomType.maxOccupancy} guests
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Bed sx={{ fontSize: 16, color: pitchBlackTheme.textSecondary }} />
                        <Typography sx={{ fontSize: '0.875rem', color: pitchBlackTheme.textSecondary }}>
                          {roomType._count.rooms} available
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        color: pitchBlackTheme.textSecondary,
                        mb: 3,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {roomType.description}
                    </Typography>
                    <Button
                      fullWidth
                      component={Link}
                      href={`/properties/${property.slug}/rooms/${roomType.id}`}
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
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Contact Information */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: pitchBlackTheme.text,
              mb: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Contact Information
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              },
              gap: 4,
            }}
          >
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                p: 3,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: pitchBlackTheme.text,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
                },
              }}
            >
              <Phone sx={{ fontSize: 40, color: pitchBlackTheme.accent, mb: 2 }} />
              <Typography 
                sx={{ 
                  fontWeight: 600, 
                  color: pitchBlackTheme.text, 
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Phone
              </Typography>
              <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                {property.phone || '+1 (555) 123-4567'}
              </Typography>
            </Card>
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                p: 3,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: pitchBlackTheme.text,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
                },
              }}
            >
              <Email sx={{ fontSize: 40, color: pitchBlackTheme.accent, mb: 2 }} />
              <Typography 
                sx={{ 
                  fontWeight: 600, 
                  color: pitchBlackTheme.text, 
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Email
              </Typography>
              <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                {property.email || `info@${slug}.com`}
              </Typography>
            </Card>
            <Card
              sx={{
                backgroundColor: pitchBlackTheme.surface,
                border: `1px solid ${pitchBlackTheme.border}`,
                borderRadius: 0,
                p: 3,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: pitchBlackTheme.text,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
                },
              }}
            >
              <LocationOn sx={{ fontSize: 40, color: pitchBlackTheme.accent, mb: 2 }} />
              <Typography 
                sx={{ 
                  fontWeight: 600, 
                  color: pitchBlackTheme.text, 
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Address
              </Typography>
              <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                {property.address || `${property.city}${property.state ? ', ' + property.state : ''}, ${property.country}`}
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: pitchBlackTheme.surface,
            p: { xs: 6, md: 8 },
            borderRadius: 0,
            border: `1px solid ${pitchBlackTheme.border}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: pitchBlackTheme.text,
              boxShadow: `0 8px 24px ${pitchBlackTheme.selectedBg}`,
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: pitchBlackTheme.text,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Ready to Experience Luxury?
          </Typography>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '1.2rem',
              lineHeight: 1.6,
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Book your stay at {property.displayName} and discover why we&apos;re the preferred choice for discerning travelers.
          </Typography>
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 16, transition: 'color 0.3s ease' }} />}
            sx={{
              backgroundColor: pitchBlackTheme.primary,
              color: pitchBlackTheme.text,
              border: `2px solid ${pitchBlackTheme.text}`,
              px: 8,
              py: 3,
              fontSize: '0.8rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              borderRadius: 0,
              fontFamily: '"Arial Black", "Helvetica", sans-serif',
              transition: 'all 0.2s ease',
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
            Book Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PropertyPage;