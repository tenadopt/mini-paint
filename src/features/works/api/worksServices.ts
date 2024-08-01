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
    if (!docSnap.exists()) {
        return null
    }

        return { id: docSnap.id, ...(docSnap.data() as Omit<Work, 'id'>), createdAt: docSnap.data().createdAt.toDate() };

};

export const addWork = (work: Omit<Work, 'id' | 'createdAt'>)=> {
    addDoc(collection(db, 'works'), {
        ...work,
        createdAt: new Date()
    });
};

export const updateWork = (id: string, updatedData: Partial<Omit<Work, 'id' | 'createdAt'>>) => {
    const docRef = doc(db, 'works', id);
    setDoc(docRef, { ...updatedData, updatedAt: new Date() }, { merge: true });
};

export const deleteWork = (id: string)=> {
    const docRef = doc(db, 'works', id);
    deleteDoc(docRef);
};