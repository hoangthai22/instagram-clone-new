import { useEffect, useState } from "react";
import { db } from "../firebase/config.js";

export const useFireStoreToListenNofiMessage = (collection, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt");
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);
    }

    const unsubcribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        if (doc?.data().seen === false) {
          return {
            ...doc.data(),
            id: doc.id,
          };
        } else {
          return null;
        }
      });

      setDocuments(documents);
    });

    return unsubcribe;
  }, [collection, condition]);
  //   //nếu collection và condition có sự thay đổi thì nó sẽ thực thi unsubcribe trước
  //   //nó sẽ hủy theo dõi cái collection cũ sau đó mới thực hiền đoạn code lắng nghe
  //   // trên collection mới này
  return documents;
};

export const useFireStore = (collection, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt");
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);
    }

    const unsubcribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(documents);
    });

    return unsubcribe;
  }, [collection, condition]);

  return documents;
};

export const useFireStoreToListenNofiLike = (collection, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt");
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);
    }
    const unsubcribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docChanges().map((change) => {
        if (change.type === "modified") {
          return { ...change.doc.data(), id: change.doc.id };
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });
      setDocuments(documents);
    });

    return unsubcribe;
  }, [collection, condition]);

  return documents;
};

export async function fetchUserList(search, curMembers) {
  return db
    .collection("users")
    .where("keyword", "array-contains", search)
    .orderBy("displayName")
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
          listFollower: doc.data().listFollower,
          listFollow: doc.data().listFollow,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
    });
}
