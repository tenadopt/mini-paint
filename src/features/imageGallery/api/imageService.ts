import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from 'firebaseConfig';
import { toast } from 'react-toastify';

export interface Image {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    userId: string;
    createdAt?: Date;
}

export const fetchImages = async (userId?: string): Promise<Image[]> => {
    try {
        const imagesCollection = collection(db, 'works');
        const q = userId
            ? query(imagesCollection, where('userId', '==', userId))
            : query(imagesCollection);
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                ...(data as Omit<Image, 'id'>),
                createdAt: data.createdAt?.toDate()
            };
        });

        return images;
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(`Error fetching images: ${error.message}`);
            throw new Error(`Failed to fetch images: ${error.message}`);
        } else {
            toast.error('Unexpected error while fetching images');
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
            toast.error(`Error saving image: ${error.message}`);
            throw new Error('Failed to save image: ' + error.message);
        } else {
            toast.error('Unexpected error while saving image');
            throw new Error('Failed to save image: unknown error');
        }
    }
};

export const deleteImage = async (id: string, imageUrl?: string): Promise<void> => {
    try {
        const docRef = doc(db, 'works', id);

        await deleteDoc(docRef);

        if (imageUrl) {
            const storage = getStorage();
            const storageRef = ref(storage, imageUrl);

            await deleteObject(storageRef);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(`Error deleting image: ${error.message}`);
            throw new Error('Failed to delete image: ' + error.message);
        } else {
            toast.error('Unexpected error while deleting image');
            throw new Error('Failed to delete image: unknown error');
        }
    }
};