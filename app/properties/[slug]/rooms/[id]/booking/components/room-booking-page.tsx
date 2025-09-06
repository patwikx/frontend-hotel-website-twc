'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
  IconButton,
  Alert,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  CreditCard,
  Add,
  Remove,
  LocationOn,
  CheckCircle,
  Cancel,
  Info,
  Phone,
  Email,
  Warning,
  Person,
  CalendarToday,
  Group,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingFormData, PaymentModalState, PaymentStatusResponse, PricingBreakdown, RoomBookingClientProps } from '@/types/room-booking-types';
import { AvailabilityCalendar } from './calendar-availability';

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
};

const steps = ['Guest Details', 'Stay Details', 'Review & Payment'];

export function RoomBookingClient({ property, roomType }: RoomBookingClientProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    guestNotes: '',
  });

  const [checkInDateObj, setCheckInDateObj] = useState<Date | null>(null);
  const [checkOutDateObj, setCheckOutDateObj] = useState<Date | null>(null);
  const [nights, setNights] = useState(0);

  const [pricing, setPricing] = useState<PricingBreakdown>({
    subtotal: 0,
    nights: 0,
    taxes: 0,
    serviceFee: 0,
    totalAmount: 0,
  });

  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    isOpen: false,
    status: 'checking',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to calculate pricing using the API
  const calculatePricing = useCallback(async (checkInDate: string, checkOutDate: string) => {
    if (!checkInDate || !checkOutDate) return;

    setIsCalculatingPrice(true);
    
    try {
      const params = new URLSearchParams({
        businessUnitId: property.id,
        roomTypeId: roomType.id,
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
      });

      const response = await axios.get(`/api/pricing/calculate?${params}`);
      const pricingData = response.data;
      
      setPricing({
        subtotal: pricingData.subtotal,
        nights: pricingData.nights,
        taxes: pricingData.taxes,
        serviceFee: pricingData.serviceFee,
        totalAmount: pricingData.totalAmount,
      });
      
      setNights(pricingData.nights);
      
    } catch (error) {
      console.error('Error calculating pricing:', error);
      // Reset to basic calculation on error
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const calculatedNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      if (calculatedNights > 0) {
        setNights(calculatedNights);
        setPricing(prev => ({
          ...prev,
          subtotal: roomType.baseRate * calculatedNights,
          nights: calculatedNights,
          taxes: 0,
          serviceFee: 0,
          totalAmount: roomType.baseRate * calculatedNights,
        }));
      }
    } finally {
      setIsCalculatingPrice(false);
    }
  }, [property.id, roomType.id, roomType.baseRate]);

  // Update form data when date objects change
  useEffect(() => {
    if (checkInDateObj) {
      const dateString = checkInDateObj.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, checkInDate: dateString }));
    }
  }, [checkInDateObj]);

  useEffect(() => {
    if (checkOutDateObj) {
      const dateString = checkOutDateObj.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, checkOutDate: dateString }));
    }
  }, [checkOutDateObj]);

  // Calculate pricing when dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      calculatePricing(formData.checkInDate, formData.checkOutDate);
    } else {
      setPricing({
        subtotal: 0,
        nights: 0,
        taxes: 0,
        serviceFee: 0,
        totalAmount: 0,
      });
      setNights(0);
    }
  }, [formData.checkInDate, formData.checkOutDate, calculatePricing]);

  // Handle polling for payment status
  const startPolling = useCallback((sessionId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get<PaymentStatusResponse>(`/api/booking/payment-status?sessionId=${sessionId}`);
        const { status, confirmationNumber } = response.data;
        
        console.log(`Polling for session ${sessionId}, current status: ${status}`);
        
        if (status === 'paid' || status === 'failed' || status === 'cancelled') {
          setPaymentModal({
            isOpen: true,
            status,
            confirmationNumber,
          });
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        setPaymentModal({
          isOpen: true,
          status: 'failed',
          confirmationNumber: undefined,
        });
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  const handleCheckInDateChange = useCallback((date: Date | null) => {
    setCheckInDateObj(date);
    
    // Clear checkout date if it's before the new check-in date
    if (date && checkOutDateObj && checkOutDateObj <= date) {
      setCheckOutDateObj(null);
    }
    
    if (errors.checkInDate) {
      setErrors(prev => ({ ...prev, checkInDate: '' }));
    }
  }, [checkOutDateObj, errors.checkInDate]);

  const handleCheckOutDateChange = useCallback((date: Date | null) => {
    setCheckOutDateObj(date);
    
    if (errors.checkOutDate) {
      setErrors(prev => ({ ...prev, checkOutDate: '' }));
    }
  }, [errors.checkOutDate]);

  const handleGuestCountChange = useCallback((type: 'adults' | 'children', increment: boolean) => {
    setFormData(prev => {
      const currentCount = prev[type];
      const newCount = increment ? currentCount + 1 : Math.max(type === 'adults' ? 1 : 0, currentCount - 1);
      
      if (type === 'adults' && newCount > roomType.maxAdults) return prev;
      if (type === 'children' && newCount > roomType.maxChildren) return prev;
      if ((prev.adults + prev.children) >= roomType.maxOccupancy && increment) return prev;
      
      return {
        ...prev,
        [type]: newCount,
      };
    });
  }, [roomType.maxAdults, roomType.maxChildren, roomType.maxOccupancy]);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    }
    
    if (step === 1) {
      if (!checkInDateObj) newErrors.checkInDate = 'Check-in date is required';
      if (!checkOutDateObj) newErrors.checkOutDate = 'Check-out date is required';
      
      if (checkInDateObj && checkOutDateObj) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkInDateObj < today) newErrors.checkInDate = 'Check-in date cannot be in the past';
        if (checkOutDateObj <= checkInDateObj) newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }
      
      const totalGuests = formData.adults + formData.children;
      if (totalGuests > roomType.maxOccupancy) {
        newErrors.guests = `Maximum ${roomType.maxOccupancy} guests allowed`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, checkInDateObj, checkOutDateObj, roomType.maxOccupancy]);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        ...formData,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        checkOutDate: new Date(formData.checkOutDate).toISOString(),
        businessUnitId: property.id,
        roomTypeId: roomType.id,
        nights: nights,
        subtotal: pricing.subtotal,
        taxes: pricing.taxes,
        serviceFee: pricing.serviceFee,
        totalAmount: pricing.totalAmount,
      };

      const response = await axios.post('/api/booking/create-with-payment', bookingData);
      
      const { checkoutUrl, paymentSessionId } = response.data;
      
      window.open(checkoutUrl, '_blank');
      
      setPaymentModal({
        isOpen: true,
        status: 'checking',
        sessionId: paymentSessionId,
      });

      startPolling(paymentSessionId);

    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setPaymentModal({
        isOpen: true,
        status: 'failed',
        confirmationNumber: undefined,
      });
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }));
    
    if (paymentModal.status === 'paid' && paymentModal.confirmationNumber) {
      router.push(`/booking/success?confirmation=${paymentModal.confirmationNumber}`);
    }
  };

  const totalGuests = formData.adults + formData.children;
  const primaryImage = roomType.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 }, minHeight: '500px' }}>
            {/* Left Side - Guest Details Form */}
            <Box sx={{ flex: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 6 } }}>
                <Person sx={{ color: pitchBlackTheme.gold, fontSize: { xs: 24, md: 32 } }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: pitchBlackTheme.gold, textTransform: 'uppercase', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  Guest Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 4 }, maxWidth: '800px' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: pitchBlackTheme.surface,
                        '& fieldset': { borderColor: pitchBlackTheme.border },
                        '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                        height: '56px',
                      },
                      '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                      '& .MuiInputBase-input': { color: pitchBlackTheme.text, fontSize: '1.1rem' },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: pitchBlackTheme.surface,
                        '& fieldset': { borderColor: pitchBlackTheme.border },
                        '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                        height: '56px',
                      },
                      '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                      '& .MuiInputBase-input': { color: pitchBlackTheme.text, fontSize: '1.1rem' },
                    }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: pitchBlackTheme.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: pitchBlackTheme.surface,
                      '& fieldset': { borderColor: pitchBlackTheme.border },
                      '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                      height: '56px',
                    },
                    '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                    '& .MuiInputBase-input': { color: pitchBlackTheme.text, fontSize: '1.1rem' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: pitchBlackTheme.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: pitchBlackTheme.surface,
                      '& fieldset': { borderColor: pitchBlackTheme.border },
                      '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                      height: '56px',
                    },
                    '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                    '& .MuiInputBase-input': { color: pitchBlackTheme.text, fontSize: '1.1rem' },
                  }}
                />
              </Box>
            </Box>

            {/* Right Side - Guest Notes Section */}
            <Box sx={{ flex: 2 }}>
              <Typography variant="h6" sx={{ color: pitchBlackTheme.gold, fontWeight: 600, mb: 3, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Additional Notes (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.guestNotes}
                onChange={(e) => handleInputChange('guestNotes', e.target.value)}
                placeholder="Any special notes or preferences we should know about?"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                  },
                  '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                  '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                }}
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 }, minHeight: '500px' }}>
            {/* Left Side - Dates and Guests */}
            <Box sx={{ flex: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 6 } }}>
                <CalendarToday sx={{ color: pitchBlackTheme.gold, fontSize: { xs: 24, md: 32 } }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: pitchBlackTheme.gold, textTransform: 'uppercase', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  Stay Details
                </Typography>
              </Box>

              {/* Dates Section */}
              <Box sx={{ mb: { xs: 4, md: 6 } }}>
                <Typography variant="h6" sx={{ mb: 3, color: pitchBlackTheme.text, fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  Check-in & Check-out Dates
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                  <AvailabilityCalendar
                    businessUnitId={property.id}
                    roomTypeId={roomType.id}
                    selectedDate={checkInDateObj}
                    onDateChange={handleCheckInDateChange}
                    label="Check-in Date *"
                    minDate={new Date()}
                    error={!!errors.checkInDate}
                    helperText={errors.checkInDate || `Available from ${property.checkInTime || '3:00 PM'}`}
                  />
                  <AvailabilityCalendar
                    businessUnitId={property.id}
                    roomTypeId={roomType.id}
                    selectedDate={checkOutDateObj}
                    onDateChange={handleCheckOutDateChange}
                    label="Check-out Date *"
                    minDate={checkInDateObj ? new Date(checkInDateObj.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                    error={!!errors.checkOutDate}
                    helperText={errors.checkOutDate || `Check out by ${property.checkOutTime || '12:00 PM'}`}
                  />
                </Box>
              </Box>

              {/* Guests Section */}
              <Box>
               <Box sx={{
  display: 'flex',
  gap: 2,
  mb: 3,
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' }
}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Group sx={{ color: pitchBlackTheme.gold, fontSize: { xs: 24, md: 32 } }} />
                    <Typography variant="h6" sx={{ color: pitchBlackTheme.text, fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Number of Guests
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary, mt: { xs: 1, sm: 0 } }}>
                    (Maximum {roomType.maxOccupancy} total)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                  <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, flex: 1 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3, px: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: pitchBlackTheme.text }}>
                          Adults
                        </Typography>
                        <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>
                          Age 13+ (Max {roomType.maxAdults})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
                        <IconButton
                          onClick={() => handleGuestCountChange('adults', false)}
                          disabled={formData.adults <= 1}
                          sx={{ 
                            color: pitchBlackTheme.text,
                            '&:disabled': { color: pitchBlackTheme.textSecondary },
                            width: '48px',
                            height: '48px',
                          }}
                        >
                          <Remove fontSize="large" />
                        </IconButton>
                        <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 700, color: pitchBlackTheme.text, fontSize: '1.5rem' }}>
                          {formData.adults}
                        </Typography>
                        <IconButton
                          onClick={() => handleGuestCountChange('adults', true)}
                          disabled={formData.adults >= roomType.maxAdults}
                          sx={{ 
                            color: pitchBlackTheme.text,
                            '&:disabled': { color: pitchBlackTheme.textSecondary },
                            width: '48px',
                            height: '48px',
                          }}
                        >
                          <Add fontSize="large" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, flex: 1 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3, px: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: pitchBlackTheme.text }}>
                          Children
                        </Typography>
                        <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>
                          Age 0-12 (Max {roomType.maxChildren})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
                        <IconButton
                          onClick={() => handleGuestCountChange('children', false)}
                          disabled={formData.children <= 0}
                          sx={{ 
                            color: pitchBlackTheme.text,
                            '&:disabled': { color: pitchBlackTheme.textSecondary },
                            width: '48px',
                            height: '48px',
                          }}
                        >
                          <Remove fontSize="large" />
                        </IconButton>
                        <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 700, color: pitchBlackTheme.text, fontSize: '1.5rem' }}>
                          {formData.children}
                        </Typography>
                        <IconButton
                          onClick={() => handleGuestCountChange('children', true)}
                          disabled={formData.children >= roomType.maxChildren || totalGuests >= roomType.maxOccupancy}
                          sx={{ 
                            color: pitchBlackTheme.text,
                            '&:disabled': { color: pitchBlackTheme.textSecondary },
                            width: '48px',
                            height: '48px',
                          }}
                        >
                          <Add fontSize="large" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                {errors.guests && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {errors.guests}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Right Side - Special Requests & Pricing */}
            <Box sx={{ flex: 2 }}>
              {/* Special Requests */}
              <Typography variant="h6" sx={{ color: pitchBlackTheme.gold, fontWeight: 600, mb: 3, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Special Requests (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requests or preferences for your stay? (Early check-in, room preferences, dietary restrictions, etc.)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.gold },
                  },
                  '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                  '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                }}
              />

              {/* Live Pricing Preview */}
              {(checkInDateObj && checkOutDateObj) && (
                <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, mt: { xs: 2, md: 3 } }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" sx={{ color: pitchBlackTheme.gold, fontWeight: 600, mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      Price Estimate
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: pitchBlackTheme.text }}>
                        {nights} {nights === 1 ? 'night' : 'nights'}
                      </Typography>
                      <Typography variant="h6" sx={{ color: pitchBlackTheme.gold, fontWeight: 700 }}>
                        {isCalculatingPrice ? (
                          <CircularProgress size={20} sx={{ color: pitchBlackTheme.gold }} />
                        ) : (
                          `₱${pricing.totalAmount.toLocaleString()}`
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 }, minHeight: '500px' }}>
            {/* Left Side - Booking Summary */}
            <Box sx={{ flex: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 6 } }}>
                <CreditCard sx={{ color: pitchBlackTheme.gold, fontSize: { xs: 24, md: 32 } }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: pitchBlackTheme.gold, textTransform: 'uppercase', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  Review & Confirm
                </Typography>
              </Box>

              {/* Guest Information */}
              <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: pitchBlackTheme.gold, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    Guest Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: { xs: 2, sm: 4 } }}>
                    <Box sx={{ minWidth: '200px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Primary Guest</Typography>
                      <Typography variant="h6" sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>
                        {formData.firstName} {formData.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '250px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Email</Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 500 }}>
                        {formData.email}
                      </Typography>
                    </Box>
                    {formData.phone && (
                      <Box sx={{ minWidth: '200px' }}>
                        <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Phone</Typography>
                        <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 500 }}>
                          {formData.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Stay Information */}
              <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: pitchBlackTheme.gold, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    Stay Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: { xs: 2, sm: 4 } }}>
                    <Box sx={{ minWidth: '200px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Check-in</Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>
                        {checkInDateObj && checkInDateObj.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '200px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Check-out</Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>
                        {checkOutDateObj && checkOutDateObj.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '150px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Duration</Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>
                        {nights} {nights === 1 ? 'Night' : 'Nights'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: '150px' }}>
                      <Typography variant="body2" sx={{ color: pitchBlackTheme.textSecondary }}>Guests</Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 600 }}>
                        {formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                        {formData.children > 0 && `, ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Special Requests (now read-only) */}
              {formData.specialRequests && (
                <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}` }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: pitchBlackTheme.gold, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      Special Requests
                    </Typography>
                    <Typography sx={{ color: pitchBlackTheme.text, fontStyle: 'italic', lineHeight: 1.6 }}>
                      &quot;{formData.specialRequests}&quot;
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Right Side - Pricing Breakdown */}
            <Box sx={{ flex: 2 }}>
              <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 4, color: pitchBlackTheme.gold, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    Price Breakdown
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                        Room Rate ({nights} {nights === 1 ? 'night' : 'nights'})
                      </Typography>
                      <Typography sx={{ color: pitchBlackTheme.text, fontWeight: 500, fontSize: '1.1rem' }}>
                        {isCalculatingPrice ? (
                          <CircularProgress size={16} sx={{ color: pitchBlackTheme.text }} />
                        ) : (
                          `₱${pricing.subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          })}`
                        )}
                      </Typography>
                    </Box>

                    {pricing.taxes > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Taxes</Typography>
                        <Typography sx={{ color: pitchBlackTheme.text }}>
                          {isCalculatingPrice ? (
                            <CircularProgress size={16} sx={{ color: pitchBlackTheme.text }} />
                          ) : (
                            `₱${pricing.taxes.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          })}`
                          )}
                        </Typography>
                      </Box>
                    )}

                    {pricing.serviceFee > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: pitchBlackTheme.textSecondary }}>Service Fee</Typography>
                        <Typography sx={{ color: pitchBlackTheme.text }}>
                          {isCalculatingPrice ? (
                            <CircularProgress size={16} sx={{ color: pitchBlackTheme.text }} />
                          ) : (
                            `₱${pricing.serviceFee.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          })}`
                          )}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ borderColor: pitchBlackTheme.border, my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: pitchBlackTheme.text, fontSize: { xs: '1.25rem', md: '2.125rem' } }}>
                        Total Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: pitchBlackTheme.gold, fontSize: { xs: '1.25rem', md: '2.125rem' } }}>
                        {isCalculatingPrice ? (
                          <CircularProgress size={24} sx={{ color: pitchBlackTheme.gold }} />
                        ) : (
                          `₱${pricing.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          })}`
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ backgroundColor: pitchBlackTheme.background, minHeight: '100vh' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1600px', py: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: pitchBlackTheme.text,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Book Your Stay
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: pitchBlackTheme.textSecondary,
                  fontWeight: 400,
                }}
              >
                {property.displayName} • {roomType.displayName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LocationOn sx={{ color: pitchBlackTheme.textSecondary, fontSize: 18 }} />
                <Typography variant="body1" sx={{ color: pitchBlackTheme.textSecondary }}>
                  {property.location}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: 100,
                height: 60,
                backgroundImage: `url(${primaryImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 1,
                border: `1px solid ${pitchBlackTheme.border}`,
              }}
            />
          </Box>
        </Box>

        {/* Progress Stepper */}
        <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, mb: 4 }}>
          <CardContent sx={{ py: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 0 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: index <= activeStep ? pitchBlackTheme.text : pitchBlackTheme.textSecondary,
                        fontWeight: index <= activeStep ? 600 : 400,
                        fontSize: '1rem',
                      },
                      '& .MuiStepIcon-root': {
                        color: index < activeStep ? pitchBlackTheme.gold :
                          index === activeStep ? pitchBlackTheme.text : pitchBlackTheme.textSecondary,
                        fontSize: '2rem',
                      },
                      '& .MuiStepIcon-root.Mui-completed': {
                        color: pitchBlackTheme.gold,
                      },
                      '& .MuiStepIcon-text': {
                        fill: pitchBlackTheme.background,
                        fontSize: '1rem',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card sx={{ backgroundColor: pitchBlackTheme.surface, border: `1px solid ${pitchBlackTheme.border}`, mb: 4 }}>
          <CardContent sx={{ p: 6 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              color: pitchBlackTheme.textSecondary,
              '&:disabled': { color: pitchBlackTheme.border },
              fontSize: '1rem',
              py: 2,
              px: 4,
            }}
          >
            ← Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || isCalculatingPrice || pricing.totalAmount === 0}
              startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'black' }} /> : <CreditCard />}
              sx={{
                backgroundColor: pitchBlackTheme.gold,
                color: pitchBlackTheme.primary,
                px: 4,
                py: 1,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.goldHover,
                },
                '&:disabled': {
                  backgroundColor: pitchBlackTheme.textSecondary,
                },
              }}
            >
              {isSubmitting ? 'Processing...' : `Confirm & Pay ₱${pricing.totalAmount.toLocaleString()}`}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: pitchBlackTheme.gold,
                color: pitchBlackTheme.primary,
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                '&:hover': {
                  backgroundColor: pitchBlackTheme.goldHover,
                },
              }}
            >
              Continue →
            </Button>
          )}
        </Box>
      </Container>

      {/* Payment Status Modal */}
      <Dialog
        open={paymentModal.isOpen}
        onClose={() => {}} 
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: pitchBlackTheme.surface,
            border: `1px solid ${pitchBlackTheme.border}`,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: pitchBlackTheme.text }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {paymentModal.status === 'checking' && (
              <>
                <CircularProgress sx={{ color: pitchBlackTheme.gold }} />
                <Typography variant="h6" sx={{ color: pitchBlackTheme.text }}>Processing Payment</Typography>
              </>
            )}
            {paymentModal.status === 'paid' && (
              <>
                <Avatar sx={{ bgcolor: pitchBlackTheme.success, width: 64, height: 64 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: pitchBlackTheme.gold }}>Payment Successful!</Typography>
              </>
            )}
            {paymentModal.status === 'pending' && (
              <>
                <Avatar sx={{ bgcolor: pitchBlackTheme.warning, width: 64, height: 64 }}>
                  <Info sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: pitchBlackTheme.gold }}>Awaiting Payment</Typography>
              </>
            )}
            {paymentModal.status === 'failed' && (
              <>
                <Avatar sx={{ bgcolor: pitchBlackTheme.error, width: 64, height: 64 }}>
                  <Cancel sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: pitchBlackTheme.gold }}>Payment Failed</Typography>
              </>
            )}
            {paymentModal.status === 'cancelled' && (
              <>
                <Avatar sx={{ bgcolor: pitchBlackTheme.warning, width: 64, height: 64 }}>
                  <Warning sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: pitchBlackTheme.gold }}>Payment Cancelled</Typography>
              </>
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          {paymentModal.status === 'checking' && (
            <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
              Please wait while we verify your payment. This may take a few moments.
            </Typography>
          )}
          {paymentModal.status === 'paid' && (
            <Typography sx={{ color: pitchBlackTheme.text }}>
              Your reservation has been confirmed!
              {paymentModal.confirmationNumber && (
                <>
                  <br />
                  Confirmation Number: <strong style={{ color: pitchBlackTheme.gold }}>{paymentModal.confirmationNumber}</strong>
                </>
              )}
            </Typography>
          )}
          {paymentModal.status === 'pending' && (
            <Typography sx={{ color: pitchBlackTheme.text }}>
              Your payment is still being processed. You can close this window and check your email for confirmation.
            </Typography>
          )}
          {paymentModal.status === 'failed' && (
            <Typography sx={{ color: pitchBlackTheme.text }}>
              There was an issue processing your payment. Please try again or contact support.
            </Typography>
          )}
          {paymentModal.status === 'cancelled' && (
            <Typography sx={{ color: pitchBlackTheme.text }}>
              Your payment was cancelled. You can try booking again.
            </Typography>
          )}
        </DialogContent>

        {paymentModal.status !== 'checking' && (
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={handleModalClose}
              variant="contained"
              sx={{
                backgroundColor: pitchBlackTheme.gold,
                color: pitchBlackTheme.primary,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: pitchBlackTheme.goldHover,
                },
              }}
            >
              {paymentModal.status === 'paid' ? 'View Booking Details' : 'Try Again'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress sx={{ color: pitchBlackTheme.gold }} />
          <Typography sx={{ color: pitchBlackTheme.text }}>Creating your reservation...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}