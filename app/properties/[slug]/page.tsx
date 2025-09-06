import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { LocationOn, Phone, Email, ArrowForward, Bed, People, Wifi, Restaurant, LocalParking, FitnessCenter, Pool, Spa, RoomService, Star } from '@mui/icons-material';
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

  // Mock amenities - in real app, this would come from your data
  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Restaurant, label: 'Fine Dining' },
    { icon: Pool, label: 'Swimming Pool' },
    { icon: FitnessCenter, label: 'Fitness Center' },
    { icon: Spa, label: 'Spa & Wellness' },
    { icon: LocalParking, label: 'Valet Parking' },
    { icon: RoomService, label: '24/7 Room Service' },
  ];

  return (
    <Box sx={{ backgroundColor: pitchBlackTheme.background, color: pitchBlackTheme.text, minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '900px' }}>
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
                fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
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
              <LocationOn sx={{ color: 'white', mr: 1, fontSize: 28 }} />
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '1.5rem',
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
                maxWidth: '700px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {property.shortDescription || property.description}
            </Typography>

            {/* Key Stats */}
            <Box sx={{ display: 'flex', gap: 4, mb: 6, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  {property.roomTypes.length}
                </Typography>
                <Typography sx={{ color: pitchBlackTheme.textSecondary, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  Room Types
                </Typography>
              </Box>
              <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', pl: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  {property.roomTypes.reduce((acc, room) => acc + room._count.rooms, 0)}
                </Typography>
                <Typography sx={{ color: pitchBlackTheme.textSecondary, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  Total Rooms
                </Typography>
              </Box>
              <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', pl: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: '#ffd700', fontSize: '1.2rem' }} />
                  ))}
                </Box>
                <Typography sx={{ color: pitchBlackTheme.textSecondary, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  Luxury Rating
                </Typography>
              </Box>
            </Box>

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

        {/* Scroll indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
              '40%': { transform: 'translateX(-50%) translateY(-10px)' },
              '60%': { transform: 'translateX(-50%) translateY(-5px)' },
            },
          }}
        >
          <Box
            sx={{
              width: 2,
              height: 40,
              backgroundColor: 'white',
              opacity: 0.7,
            }}
          />
        </Box>
      </Box>

      {/* Amenities Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 10, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: pitchBlackTheme.text,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            World-Class Amenities
          </Typography>
          <Typography
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '1.2rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Experience unparalleled luxury with our comprehensive suite of premium amenities and services
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {amenities.map((amenity, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .amenity-icon': {
                    color: pitchBlackTheme.accent,
                    transform: 'scale(1.1)',
                  },
                },
              }}
            >
              <amenity.icon 
                className="amenity-icon"
                sx={{ 
                  fontSize: 48, 
                  color: pitchBlackTheme.text, 
                  mb: 2,
                  transition: 'all 0.3s ease',
                }} 
              />
              <Typography
                sx={{
                  color: pitchBlackTheme.text,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.9rem',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {amenity.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Immersive Gallery Section */}
      {property.images.length > 1 && (
        <Box sx={{ py: { xs: 10, md: 15 } }}>
          <Container maxWidth="xl" sx={{ mb: 8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                color: pitchBlackTheme.text,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Visual Journey
            </Typography>
          </Container>

          {/* Large featured image */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                height: '70vh',
                backgroundImage: `url(${property.images[1]?.image.originalUrl || primaryImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '30%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                },
              }}
            />
          </Box>

          {/* Image strip */}
          <Box sx={{ display: 'flex', height: '250px', gap: 1, overflow: 'hidden' }}>
            {property.images.slice(2, 6).map((imageRelation, index) => (
              <Box
                key={imageRelation.id}
                sx={{
                  flex: 1,
                  backgroundImage: `url(${imageRelation.image.originalUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.5s ease',
                  filter: 'brightness(0.8)',
                  '&:hover': {
                    flex: 2,
                    filter: 'brightness(1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Rooms Section - Reimagined */}
      {property.roomTypes.length > 0 && (
        <Container maxWidth="xl" sx={{ py: { xs: 10, md: 15 } }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                color: pitchBlackTheme.text,
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Signature Accommodations
            </Typography>
            <Typography
              sx={{
                color: pitchBlackTheme.textSecondary,
                fontSize: '1.2rem',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Each room is a masterpiece of design and comfort, crafted for the most discerning guests
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {property.roomTypes.map((roomType, index) => (
              <Box
                key={roomType.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: index % 2 === 0 ? 'row' : 'row-reverse' },
                  alignItems: 'center',
                  gap: 8,
                  minHeight: '500px',
                }}
              >
                {/* Image Section */}
                <Box
                  sx={{
                    flex: 1,
                    height: { xs: '400px', lg: '500px' },
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${roomType.images[0]?.image.originalUrl || primaryImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'all 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  
                  {/* Price overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      backgroundColor: pitchBlackTheme.accent,
                      color: 'white',
                      px: 3,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(roomType.baseRate, roomType.currency)}
                    <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>per night</Typography>
                  </Box>
                </Box>

                {/* Content Section */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: 0, lg: 4 },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      color: pitchBlackTheme.text,
                      mb: 3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    {roomType.displayName}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 6, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People sx={{ fontSize: 20, color: pitchBlackTheme.accent }} />
                      <Typography sx={{ color: pitchBlackTheme.textSecondary, fontWeight: 600 }}>
                        Up to {roomType.maxOccupancy} guests
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Bed sx={{ fontSize: 20, color: pitchBlackTheme.accent }} />
                      <Typography sx={{ color: pitchBlackTheme.textSecondary, fontWeight: 600 }}>
                        {roomType._count.rooms} available
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      color: pitchBlackTheme.textSecondary,
                      mb: 6,
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                      maxWidth: '500px',
                    }}
                  >
                    {roomType.description}
                  </Typography>

                  <Button
                    component={Link}
                    href={`/properties/${property.slug}/rooms/${roomType.id}`}
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: pitchBlackTheme.primary,
                      color: pitchBlackTheme.text,
                      border: `2px solid ${pitchBlackTheme.text}`,
                      px: 6,
                      py: 2.5,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      borderRadius: 0,
                      fontFamily: '"Arial Black", "Helvetica", sans-serif',
                      alignSelf: 'flex-start',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: pitchBlackTheme.primaryHover,
                        borderColor: pitchBlackTheme.primaryHover,
                        color: pitchBlackTheme.primary,
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    Explore Room
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      )}

      {/* Contact Section - Minimalist */}
      <Box sx={{ backgroundColor: pitchBlackTheme.surface, py: { xs: 10, md: 15 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                color: pitchBlackTheme.text,
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Contact
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
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
            </Box>

            <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
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
            </Box>

            <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
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
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section - Keep as requested */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
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