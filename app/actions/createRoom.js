'use server';
import { createAdminClient } from '@/config/appwrite';
import checkAuth from './checkAuth';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

async function createRoom(previousState, formData) {
  console.log(
    'createRoom called with formData:',
    Object.fromEntries(formData.entries()),
  );

  // Get databases instance
  const { databases, storage } = await createAdminClient();

  try {
    const authResult = await checkAuth();

    if (!authResult.isAuthenticated) {
      return {
        error: 'You must be logged in to create a room',
      };
    }

    const user = authResult.user;

    // Uploading image
    let imageID;

    const image = formData.get('image');

    if (image && image.size > 0 && image.name !== 'undefined') {
      try {
        // Upload
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS,
          ID.unique(),
          image,
        );
        imageID = response.$id;
      } catch (error) {
        console.log('Error uploading image', error);
        return {
          error: 'Error uploading image',
        };
      }
    } else {
      console.log('No image file provided or file is invalid');
    }

    // Create room
    console.log('Creating room with data:', {
      database: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      collection: process.env.NEXT_PUBLIC_APPWRITE_TABLES_Rooms,
      user_id: user.id,
      name: formData.get('name'),
      description: formData.get('description'),
      sqft: formData.get('sqft'),
      capacity: formData.get('capacity'),
      location: formData.get('location'),
      address: formData.get('address'),
      availability: formData.get('availability'),
      price_per_hour: formData.get('price_per_hour'),
      amenities: formData.get('amenities'),
      image: imageID,
    });

    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_Rooms,
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get('name'),
        description: formData.get('description'),
        sqft: formData.get('sqft'),
        capacity: formData.get('capacity'),
        location: formData.get('location'),
        address: formData.get('address'),
        availability: formData.get('availability'),
        price_per_hour: formData.get('price_per_hour'),
        amenities: formData.get('amenities'),
        image: imageID,
      },
    );

    console.log('Room created successfully:', newRoom);

    // Revalidate the rooms pages to show the new room
    revalidatePath('/', 'layout'); // Revalidate home page (rooms listing)
    revalidatePath('/rooms/my', 'layout'); // Revalidate my rooms page

    return {
      success: true,
    };
  } catch (error) {
    console.log('Error in createRoom:', error);
    const errorMessage =
      error?.response?.message ||
      error?.message ||
      'An unexpected error has occurred';
    return {
      error: errorMessage,
    };
  }
}

export default createRoom;
