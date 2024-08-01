import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { deleteImage, fetchImages, saveImageToFirebase, Image } from 'features/imageGallery/api/imageService';
import { toast } from 'react-toastify';

export const useFetchImages = (userId?: string) => {
    return useQuery<Image[], Error>({
        queryKey: ['images', userId],
        queryFn: () => fetchImages(userId),
        enabled: !!userId,
        onError: (error: Error) => {
            console.error('Error fetching images:', error);
            toast.error(`Failed to load images: ${error.message}`);
        },
    } as UseQueryOptions<Image[], Error>);
};

export const useSaveImage = () => {
    const queryClient = useQueryClient();
    return useMutation<string, Error, string>({
        mutationFn: saveImageToFirebase,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['images']});
        },
        onError: (error: Error) => {
            console.error('Error saving image:', error);
            toast.error('Failed to save image');
        },
    });
};

export const useDeleteImage = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (id: string) => deleteImage(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['images']});
        },
        onError: (error: Error) => {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        },
    });
};