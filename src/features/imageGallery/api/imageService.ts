import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from 'firebaseConfig';

export interface Image {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    userId: string;
    createdAt: Date;
}

export const fetchImages = async (userId?: string): Promise<Image[]> => {
    const imagesCollection = collection(db, 'images');
    const q = userId
        ? query(imagesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
        : query(imagesCollection, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map<QuerySnapshot<Image>>(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt.toDate()
//     }));
// };

return querySnapshot.docs.map<Image>(doc => ({
    id: doc.id,
    title: "",
    description: "",
    imageUrl: "",
    userId: "",
    createdAt: doc.data().createdAt.toDate(),
    ...doc.data()
}));
};