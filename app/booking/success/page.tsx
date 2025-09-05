// app/booking/success/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Card, Button, Divider } from '@mui/material';
import { CheckCircleOutline, Home } from '@mui/icons-material';
import Link from 'next/link';
import { getReservationByConfirmationNumber } from '@/lib/reservation-check';

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
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  gold: '#FFFFFF',
  goldHover: '#FFFFFF',
  selectedBg: 'rgba(255, 255, 255, 0.08)',
};

interface SuccessPageProps {
  searchParams: {
    confirmation?: string;
  };
}

const SuccessPage: React.FC<SuccessPageProps> = async ({ searchParams }) => {
  const confirmationNumber = searchParams.confirmation;

  if (!confirmationNumber) {
    notFound();
  }

  const reservation = await getReservationByConfirmationNumber(confirmationNumber);

  if (!reservation) {
    notFound();
  }
  
  const guestFullName = `${reservation.guest.firstName} ${reservation.guest.lastName}`;
  const roomTypeName = reservation.rooms[0]?.roomType?.displayName || 'Room';
  const checkInDate = new Date(reservation.checkInDate).toLocaleDateString();
  const checkOutDate = new Date(reservation.checkOutDate).toLocaleDateString();
  const nights = reservation.nights;
  const totalAmount = reservation.totalAmount.toNumber();
  const currency = reservation.currency || 'PHP';

  const formatCurrency = (amount: number, cur: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
    }).format(amount);
  };

  return (
    <Box sx={{ backgroundColor: pitchBlackTheme.background, minHeight: '100vh', py: { xs: 8, md: 16 } }}>
      <Container maxWidth="md">
        <Card
          sx={{
            backgroundColor: pitchBlackTheme.surface,
            border: `1px solid ${pitchBlackTheme.border}`,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            p: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <Box sx={{ color: pitchBlackTheme.success, mb: 4 }}>
            <CheckCircleOutline sx={{ fontSize: '80px' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: pitchBlackTheme.gold,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Booking Confirmed!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: pitchBlackTheme.textSecondary,
              fontSize: '1.1rem',
              maxWidth: '500px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Thank you for your reservation, {guestFullName}. Your booking has been successfully confirmed. A detailed receipt has been sent to your email.
          </Typography>

          <Card
            sx={{
              backgroundColor: pitchBlackTheme.background,
              border: `1px solid ${pitchBlackTheme.border}`,
              borderRadius: '8px',
              p: { xs: 2, md: 4 },
              textAlign: 'left',
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: pitchBlackTheme.gold, mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Booking Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Confirmation No.:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>{confirmationNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Guest Name:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text }}>{guestFullName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Property:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text }}>{reservation.businessUnit.displayName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Room Type:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text }}>{roomTypeName}</Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: pitchBlackTheme.border }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Check-in:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>{checkInDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Check-out:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>{checkOutDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Nights:</Typography>
                <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>{nights}</Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: pitchBlackTheme.border }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: pitchBlackTheme.gold }}>
                  Total Paid:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: pitchBlackTheme.success }}>
                  {formatCurrency(totalAmount, currency)}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Button
            component={Link}
            href="/"
            variant="contained"
            startIcon={<Home />}
            sx={{
              backgroundColor: pitchBlackTheme.primary,
              color: pitchBlackTheme.text,
              border: `2px solid ${pitchBlackTheme.text}`,
              px: { xs: 4, md: 5 },
              py: { xs: 2, md: 2.5 },
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              borderRadius: 0,
              minWidth: { xs: 'auto', md: '160px' },
              fontFamily: '"Arial Black", "Helvetica", sans-serif',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: pitchBlackTheme.primaryHover,
                borderColor: pitchBlackTheme.primaryHover,
                color: pitchBlackTheme.primary,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${pitchBlackTheme.selectedBg}`,
              },
              '& .MuiSvgIcon-root': {
                color: pitchBlackTheme.text,
                transition: 'color 0.3s ease',
              },
              '&:hover .MuiSvgIcon-root': {
                color: pitchBlackTheme.primary,
              },
            }}
          >
            Go to Homepage
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default SuccessPage;