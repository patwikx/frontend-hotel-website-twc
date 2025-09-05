"use client";

import React from 'react';
import { Box, Container, Typography, Card, Avatar } from '@mui/material';
import { Hotel, Star, Shield, TrendingUp, People, StarBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';

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
  warning: '#f59e0b',
};

// Framer Motion variants
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

// Updated type definitions to handle potential null values
interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string | null;
  bio: string | null;
}

interface AboutData {
  content: string | null;
  totalProperties: number | null;
  totalRooms: number | null;
  totalEmployees: number | null;
  foundedYear: number | null;
  mission: string | null;
  vision: string | null;
  values: string | null;
  awards: string[];
  certifications: string[];
  history: string | null;
}

interface AboutContentProps {
  aboutData: AboutData | null;
  teamMembers: TeamMember[];
}

const AboutContent: React.FC<AboutContentProps> = ({ aboutData, teamMembers }) => {
  const stats = [
    { icon: Hotel, label: 'Properties', value: aboutData?.totalProperties || 4 },
    { icon: TrendingUp, label: 'Rooms', value: aboutData?.totalRooms || 200 },
    { icon: People, label: 'Team Members', value: aboutData?.totalEmployees || 500 },
    { icon: Star, label: 'Years of Excellence', value: aboutData?.foundedYear ? new Date().getFullYear() - aboutData.foundedYear : 29 },
  ];

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
              whiteSpace: 'pre-line',
              mb: 4,
            }}
          >
            Tropicana Worldwide Corporation
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
            {aboutData?.content || 'Discover the story behind our commitment to luxury hospitality and exceptional guest experiences.'}
          </Typography>
        </Box>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 16 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 4,
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
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
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                    borderColor: pitchBlackTheme.text,
                  },
                }}
              >
                <stat.icon sx={{ fontSize: 48, color: pitchBlackTheme.accent, mb: 2 }} />
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    color: pitchBlackTheme.text,
                    mb: 1,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    color: pitchBlackTheme.textSecondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.875rem',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Mission, Vision, Values */}
      <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 16 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 6,
          }}
        >
          {[
            { title: 'Our Mission', content: aboutData?.mission || 'To provide exceptional hospitality experiences that create lasting memories for our guests while maintaining the highest standards of luxury and service.' },
            { title: 'Our Vision', content: aboutData?.vision || 'To be the leading luxury hospitality brand recognized globally for our commitment to excellence, innovation, and sustainable practices.' },
            { title: 'Our Values', content: aboutData?.values || 'Excellence, Integrity, Innovation, Sustainability, and Guest-Centricity guide everything we do in our pursuit of hospitality perfection.' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  borderRadius: 0,
                  p: 4,
                  height: '100%',
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
                    fontSize: '1.5rem',
                    color: pitchBlackTheme.text,
                    mb: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: pitchBlackTheme.textSecondary,
                    lineHeight: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {item.content}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 16 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: pitchBlackTheme.text,
              mb: 8,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Leadership Team
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 6,
            }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
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
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${pitchBlackTheme.selectedBg}`,
                      borderColor: pitchBlackTheme.text,
                    },
                  }}
                >
                  <Avatar
                    src={member.image || undefined}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      border: `4px solid ${pitchBlackTheme.border}`,
                      fontSize: '3rem',
                      fontWeight: 700,
                      backgroundColor: pitchBlackTheme.accent,
                      color: 'white',
                    }}
                  >
                    {!member.image && member.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: pitchBlackTheme.text,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    {member.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: pitchBlackTheme.accent,
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {member.position}
                  </Typography>

                  {member.bio && (
                    <Typography
                      sx={{
                        color: pitchBlackTheme.textSecondary,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {member.bio}
                    </Typography>
                  )}
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      )}

      {/* Awards & Certifications */}
      {aboutData && (aboutData.awards.length > 0 || aboutData.certifications.length > 0) && (
        <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 16 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: pitchBlackTheme.text,
              mb: 8,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Awards & Recognition
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)'
              },
              gap: 6,
            }}
          >
            {aboutData.awards.length > 0 && (
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  borderRadius: 0,
                  p: 6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 28px ${pitchBlackTheme.selectedBg}`,
                    borderColor: pitchBlackTheme.text,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <StarBorder sx={{ fontSize: 32, color: pitchBlackTheme.warning, mr: 2 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      color: pitchBlackTheme.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Awards
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {aboutData.awards.map((award, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, color: pitchBlackTheme.warning, mr: 2 }} />
                      <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                        {award}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}

            {aboutData.certifications.length > 0 && (
              <Card
                sx={{
                  backgroundColor: pitchBlackTheme.surface,
                  border: `1px solid ${pitchBlackTheme.border}`,
                  borderRadius: 0,
                  p: 6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 28px ${pitchBlackTheme.selectedBg}`,
                    borderColor: pitchBlackTheme.text,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Shield sx={{ fontSize: 32, color: pitchBlackTheme.accent, mr: 2 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      color: pitchBlackTheme.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    Certifications
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {aboutData.certifications.map((cert, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Shield sx={{ fontSize: 16, color: pitchBlackTheme.accent, mr: 2 }} />
                      <Typography sx={{ color: pitchBlackTheme.textSecondary }}>
                        {cert}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}
          </Box>
        </Container>
      )}

      {/* History Section */}
      {aboutData?.history && (
        <Container maxWidth="xl" sx={{ mb: { xs: 8, md: 16 } }}>
          <Card
            sx={{
              backgroundColor: pitchBlackTheme.surface,
              border: `1px solid ${pitchBlackTheme.border}`,
              borderRadius: 0,
              p: { xs: 6, md: 8 },
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
                fontSize: { xs: '2rem', md: '3rem' },
                color: pitchBlackTheme.text,
                mb: 6,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Our History
            </Typography>
            <Typography
              sx={{
                color: pitchBlackTheme.textSecondary,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {aboutData.history}
            </Typography>
          </Card>
        </Container>
      )}
    </>
  );
};

export default AboutContent;