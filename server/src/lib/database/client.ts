import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import type { FirebaseOptions, FirebaseApp } from "firebase/app";
import type { DocumentData, Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

interface Options {
  /** Configuration for the database connection */
  config: FirebaseOptions;
}

export class DatabaseClient {
  /** @internal */
  private readonly app: FirebaseApp;
  /** @internal */
  private readonly auth: Auth;
  /** @internal */
  private readonly db: Firestore;

  constructor(options: Options) {
    const app = initializeApp(options.config);
    this.app = app;

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  public async fetchCollection(
    collectionName: string
  ): Promise<DocumentData[]> {
    return signInAnonymously(this.auth).then(async () => {
      const col = collection(this.db, collectionName);
      const snapshot = await getDocs(col);
      const list = snapshot.docs.map((doc) => {
        return { data: doc.data(), id: doc.id };
      });
      return Array.from(list);
    });
  }

  public async deleteFromColletionWithId(
    collectionName: string,
    id: string
  ): Promise<boolean> {
    const docRef = doc(this.db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  }

  public async injectIntoCollectionWithId(
    collectionName: string,
    id: string,
    data: any
  ): Promise<boolean> {
    const docRef = doc(this.db, collectionName, id);
    await setDoc(docRef, data);
    return true;
  }
}
