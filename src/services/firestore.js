import { doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { firebaseApp } from "./firebaseApp";

export const db = getFirestore(firebaseApp);
export { doc, getDoc, onSnapshot, setDoc };
