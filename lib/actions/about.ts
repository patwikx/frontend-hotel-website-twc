'use server';

import { prisma } from '../prisma';
import { cache } from 'react';

export interface AboutData {
  id: string;
  title: string;
  content: string;
  mission: string | null;
  vision: string | null;
  values: string | null;
  history: string | null;
  foundedYear: number | null;
  totalProperties: number;
  totalRooms: number;
  totalEmployees: number | null;
  awards: string[];
  certifications: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberData {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image: string | null;
  linkedIn: string | null;
  email: string | null;
  sortOrder: number;
  isActive: boolean;
}

export const getAboutData = cache(async (): Promise<AboutData | null> => {
  try {
    // Get the first active about page
    const about = await prisma.aboutPage.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!about) return null;

    // Get statistics
    const [totalProperties, totalRooms] = await Promise.all([
      prisma.businessUnit.count({
        where: {
          isActive: true,
          isPublished: true,
        },
      }),
      prisma.room.count({
        where: {
          isActive: true,
          businessUnit: {
            isActive: true,
            isPublished: true,
          },
        },
      }),
    ]);

    return {
      ...about,
      totalProperties,
      totalRooms,
      awards: about.awards as string[],
      certifications: about.certifications as string[],
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
});

export const getTeamMembers = cache(async (): Promise<TeamMemberData[]> => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
});