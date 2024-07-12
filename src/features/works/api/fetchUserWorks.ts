import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import { Work } from "features/works/types";

export const fetchUserWorks = async (userId: string): Promise<Work[]> => {
    const worksCollection = collection(db, "works");
    const q = query(worksCollection, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const works: Work[] = [];
    querySnapshot.forEach((doc) => {
        works.push({ id: doc.id, ...doc.data() } as Work);
    });

    return works;
};