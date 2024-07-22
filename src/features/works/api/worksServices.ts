import { collection, doc, getDoc, setDoc, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { Work } from 'features/works/types';

export const fetchUserWorks = async (userId: string): Promise<Work[]> => {
    const worksCollection = collection(db, 'works');
    const q = query(worksCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Work, 'id'>),
        createdAt: doc.data().createdAt.toDate()
    }));
};

export const fetchWorkById = async (id: string): Promise<Work | null> => {
    const docRef = doc(db, 'works', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Work, 'id'>), createdAt: docSnap.data().createdAt.toDate() };
    } else {
        return null;
    }
};

export const addWork = async (work: Omit<Work, 'id' | 'createdAt'>): Promise<void> => {
    await addDoc(collection(db, 'works'), {
        ...work,
        createdAt: new Date()
    });
};

export const updateWork = async (id: string, updatedData: Partial<Omit<Work, 'id' | 'createdAt'>>): Promise<void> => {
    const docRef = doc(db, 'works', id);
    await setDoc(docRef, { ...updatedData, updatedAt: new Date() }, { merge: true });
};

export const deleteWork = async (id: string): Promise<void> => {
    const docRef = doc(db, 'works', id);
    await deleteDoc(docRef);
};