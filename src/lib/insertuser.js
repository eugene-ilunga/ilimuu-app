import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // your initialized firestore client

export async function insertUser({
  id,
  name,
  email,
  image,
  role,
  deviceToken,
}) {
    console.log("Inserting user:", id, name, email, image, role, deviceToken);
  const userRef = doc(db, "Utilisateurs", id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      class: "",
      id: id,
      name,
      email,
      imageUrl: image,
      role,
      device_token: deviceToken,
      timestamp: Timestamp.now(),
    });
  }
}
