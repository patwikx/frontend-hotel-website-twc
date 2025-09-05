"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Phone, Email, LocationOn, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getContactLocations, submitContactForm, ContactFormData } from '@/lib/actions/contact';

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
  error: '#ef4444',
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

interface ContactContentProps {
  locations: Awaited<ReturnType<typeof getContactLocations>>;
}

const ContactContent: React.FC<ContactContentProps> = ({ locations }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    businessUnitId: '',
    preferredContact: 'EMAIL',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitContactForm({
        ...formData,
        businessUnitId: formData.businessUnitId || null,
        phone: formData.phone || null,
      });

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          businessUnitId: '',
          preferredContact: 'EMAIL',
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Corrected: Added the top padding (pt) to align with other pages.
    <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 16 }, pb: { xs: 8, md: 16 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr'
          },
          gap: 8,
        }}
      >
        {/* Contact Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Card
            sx={{
              backgroundColor: pitchBlackTheme.surface,
              border: `1px solid ${pitchBlackTheme.border}`,
              borderRadius: 0,
              p: { xs: 4, md: 6 },
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 28px ${pitchBlackTheme.selectedBg}`,
                borderColor: pitchBlackTheme.text,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '2rem',
                color: pitchBlackTheme.text,
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Send us a Message
            </Typography>

            {submitStatus && (
              <Alert 
                severity={submitStatus.type} 
                sx={{ 
                  mb: 3,
                  backgroundColor: submitStatus.type === 'success' ? pitchBlackTheme.success : pitchBlackTheme.error,
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: 'white',
                  },
                }}
              >
                {submitStatus.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: pitchBlackTheme.surface,
                      '& fieldset': { borderColor: pitchBlackTheme.border },
                      '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                    },
                    '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                    '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: pitchBlackTheme.surface,
                      '& fieldset': { borderColor: pitchBlackTheme.border },
                      '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                    },
                    '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                    '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                  },
                  '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                  '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: pitchBlackTheme.textSecondary }}>Property (Optional)</InputLabel>
                <Select
                  value={formData.businessUnitId}
                  onChange={(e) => handleInputChange('businessUnitId', e.target.value || "")}
                  sx={{
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                    '& .MuiSelect-select': { color: pitchBlackTheme.text },
                  }}
                >
                  <MenuItem value="">General Inquiry</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                  },
                  '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                  '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                }}
              />

              <TextField
                fullWidth
                label="Message"
                multiline
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: pitchBlackTheme.surface,
                    '& fieldset': { borderColor: pitchBlackTheme.border },
                    '&:hover fieldset': { borderColor: pitchBlackTheme.text },
                  },
                  '& .MuiInputLabel-root': { color: pitchBlackTheme.textSecondary },
                  '& .MuiInputBase-input': { color: pitchBlackTheme.text },
                }}
              />

              <Box>
                <Typography sx={{ color: pitchBlackTheme.text, mb: 2, fontWeight: 600 }}>
                  Preferred Contact Method
                </Typography>
                <RadioGroup
                  value={formData.preferredContact}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  row
                >
                  <FormControlLabel
                    value="EMAIL"
                    control={<Radio sx={{ color: pitchBlackTheme.textSecondary }} />}
                    label="Email"
                    sx={{ color: pitchBlackTheme.textSecondary }}
                  />
                  <FormControlLabel
                    value="PHONE"
                    control={<Radio sx={{ color: pitchBlackTheme.textSecondary }} />}
                    label="Phone"
                    sx={{ color: pitchBlackTheme.textSecondary }}
                  />
                </RadioGroup>
              </Box>

              <Button
                type="submit"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                sx={{
                  backgroundColor: pitchBlackTheme.primary,
                  color: pitchBlackTheme.text,
                  border: `2px solid ${pitchBlackTheme.text}`,
                  py: 2,
                  fontSize: '0.9rem',
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
                  '&:disabled': {
                    backgroundColor: pitchBlackTheme.surface,
                    borderColor: pitchBlackTheme.border,
                    color: pitchBlackTheme.textSecondary,
                  },
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <Box>
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
            Our Locations
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
                    p: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 28px ${pitchBlackTheme.selectedBg}`,
                      borderColor: pitchBlackTheme.text,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: pitchBlackTheme.text,
                      mb: 3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    {location.displayName}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {location.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 20, color: pitchBlackTheme.textSecondary, mr: 2 }} />
                        <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                          {location.address}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 20, color: pitchBlackTheme.textSecondary, mr: 2 }} />
                      <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                        {location.city}{location.state ? `, ${location.state}` : ''}, {location.country}
                      </Typography>
                    </Box>

                    {location.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 20, color: pitchBlackTheme.textSecondary, mr: 2 }} />
                        <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                          {location.phone}
                        </Typography>
                      </Box>
                    )}

                    {location.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ fontSize: 20, color: pitchBlackTheme.textSecondary, mr: 2 }} />
                        <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                          {location.email}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactContent;