import { db } from "../firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc
} from "firebase/firestore";

export async function fetchEntriesCollection() {
  const snap = await getDocs(collection(db, "entries"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveEntryToFirestore(entry) {
  const { id, ...payload } = entry;
  if (!id) {
    const ref = await addDoc(collection(db, "entries"), payload);
    return { ...payload, id: ref.id };
  } else {
    await updateDoc(doc(db, "entries", id), payload);
    return entry;
  }
}

export async function deleteEntryFromFirestore(id) {
  await deleteDoc(doc(db, "entries", id));
}

export async function loadBackupToFirestore(entriesArray, onProgress) {
  for (let i = 0; i < entriesArray.length; i++) {
    const entry = entriesArray[i];
    if (entry.id) {
      const ref = doc(db, "entries", entry.id);
      const existing = await getDoc(ref);
      const { id, ...payload } = entry;
      if (existing.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, payload);
      }
    } else {
      const { id, ...payload } = entry;
      await addDoc(collection(db, "entries"), payload);
    }
    onProgress?.(i + 1, entriesArray.length);
  }
}
