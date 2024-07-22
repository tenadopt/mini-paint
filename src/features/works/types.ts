export interface Work {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}