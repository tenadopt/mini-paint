import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    limit,
    startAfter,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadString,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import {db} from "firebaseConfig";
import {toast} from "react-toastify";

export interface Image {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    userId: string;
    createdAt?: Date;
}

export const fetchTotalImagesCount = async (userId?: string): Promise<number> => {
    try {
        const imagesCollection = collection(db, 'works');
        const q = userId
            ? query(imagesCollection, where('userId', '==', userId))
            : query(imagesCollection);

        const querySnapshot = await getDocs(q);

        return querySnapshot.size;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error fetching image count: ${error.message}`);
            throw new Error(`Failed to fetch image count: ${error.message}`);
        } else {
            toast.error('Unexpected error while fetching image count');
            throw new Error('Failed to fetch image count: unknown error');
        }
    }
};

export const fetchImages = async (userId?: string, page = 1, limitPerPage = 15): Promise<Image[]> => {
    try {
        const imagesCollection = collection(db, 'works');
        let q = userId
            ? query(imagesCollection, where('userId', '==', userId), limit(limitPerPage))
            : query(imagesCollection, limit(limitPerPage));

        if (page > 1) {
            let lastVisible;
            for (let i = 1; i < page; i++) {
                const snapshot = await getDocs(q);
                lastVisible = snapshot.docs[snapshot.docs.length - 1];

                if (!lastVisible) break;

                q = userId
                    ? query(imagesCollection, where('userId', '==', userId), startAfter(lastVisible), limit(limitPerPage))
                    : query(imagesCollection, startAfter(lastVisible), limit(limitPerPage));
            }

            if (!lastVisible) {
                return [];
            }
        }

        const querySnapshot = await getDocs(q);
        const images = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Image, 'id'>),
            createdAt: doc.data().createdAt?.toDate()
        }));

        return images;
    } catch (error) {
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
        const storageRef = ref(storage, "images/" + Date.now() + ".png");

        await uploadString(storageRef, dataUrl, "data_url");
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error saving image: ${error.message}`);
            throw new Error("Failed to save image: " + error.message);
        } else {
            toast.error("Unexpected error while saving image");
            throw new Error("Failed to save image: unknown error");
        }
    }
};

export const deleteImage = async (
    id: string,
    imageUrl?: string,
): Promise<void> => {
    try {
        const docRef = doc(db, "works", id);

        await deleteDoc(docRef);

        if (imageUrl) {
            const storage = getStorage();
            const storageRef = ref(storage, imageUrl);

            await deleteObject(storageRef);
        }
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error deleting image: ${error.message}`);
            throw new Error("Failed to delete image: " + error.message);
        } else {
            toast.error("Unexpected error while deleting image");
            throw new Error("Failed to delete image: unknown error");
        }
    }
};

export const useFetchImages = (userId?: string, page = 1, limitPage = 15) => {
    return useQuery<Image[], Error>({
        queryKey: ["images", userId, page],
        queryFn: () => fetchImages(userId, page, limitPage),
        enabled: !!userId,
        onError: (error: Error) => {
            toast.error(`Failed to load images: ${error.message}`);
        },
    } as UseQueryOptions<Image[], Error>);
};

export const useSaveImage = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: saveImageToFirebase,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["images"]});
        },
        onError: (error: Error) => {
            toast.error(`Failed to save image: ${error.message}`);
        },
    });
};

export const useDeleteImage = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteImage,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["images"]});
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete image: ${error.message}`);
        },
    });
};