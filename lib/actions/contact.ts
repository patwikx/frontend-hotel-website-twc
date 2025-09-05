'use server';

import { prisma } from '../prisma';
import { cache } from 'react';

export interface ContactData {
  id: string;
  name: string;
  displayName: string;
  address: string | null;
  city: string;
  state: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  operatingHours: Record<string, unknown> | null;
  isActive: boolean;
  isPublished: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  businessUnitId: string | null;
  preferredContact: 'EMAIL' | 'PHONE';
}

export const getContactLocations = cache(async (): Promise<ContactData[]> => {
  try {
    const businessUnits = await prisma.businessUnit.findMany({
      where: {
        isActive: true,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        latitude: true,
        longitude: true,
        operatingHours: true,
        isActive: true,
        isPublished: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { displayName: 'asc' },
      ],
    });

    return businessUnits.map(unit => ({
      ...unit,
      operatingHours: unit.operatingHours as Record<string, unknown> | null,
    }));
  } catch (error) {
    console.error('Error fetching contact locations:', error);
    return [];
  }
});

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.contactForm.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        businessUnitId: data.businessUnitId,
        preferredContact: data.preferredContact,
        status: 'NEW',
        source: 'WEBSITE',
      },
    });

    return {
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Failed to send your message. Please try again later.',
    };
  }
}