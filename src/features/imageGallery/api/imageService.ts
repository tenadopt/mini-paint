import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from 'firebaseConfig';

export interface Image {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    userId: string;
    createdAt?: Date;
}

export const fetchImages = async (userId?: string): Promise<Image[]> => {
    console.log('Fetching images for userId:', userId);
    try {
        const imagesCollection = collection(db, 'works'); // Ensure 'works' is the correct collection name
        const q = userId
            ? query(imagesCollection, where('userId', '==', userId))
            : query(imagesCollection);
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot); // Log the raw query snapshot
        const images = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Document data:', data); // Log each document's data
            return {
                id: doc.id,
                ...(data as Omit<Image, 'id'>),
                createdAt: data.createdAt?.toDate() // Ensure createdAt is correctly parsed
            };
        });
        console.log('Images retrieved:', images);
        return images;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching images:', error);
            throw new Error(`Failed to fetch images: ${error.message}`);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Failed to fetch images: unknown error');
        }
    }
};

export const saveImageToFirebase = async (dataUrl: string): Promise<string> => {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + Date.now() + '.png');
        await uploadString(storageRef, dataUrl, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error saving image:', error);
            throw new Error('Failed to save image: ' + error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Failed to save image: unknown error');
        }
    }
};

export const deleteImage = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, 'images', id);
        await deleteDoc(docRef);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting image:', error);
            throw new Error('Failed to delete image: ' + error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Failed to delete image: unknown error');
        }
    }
};