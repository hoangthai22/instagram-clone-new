import firebase, { db, storage } from "./config";

export const addDocument = async (collection, data) => {
    const query = db.collection(collection);
    return query.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};
export const updateDocument = async (collection, data, postId) => {
    const query = db.collection(collection);
    query
        .where("postId", "==", postId)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                query.doc(doc.id).update(data);
            });
        });
    // return query.update({
    //     ...data,
    // });
};

export const deleteDocument = async (collection, id) => {
    console.log({ collection, id });
    const query = db.collection(collection);
    return query.doc(id).delete();
};

export async function uploadFile(name, uid, path) {
    const filePath = `${name}/${uid}/${path.name}`;
    const fileRef = storage.ref(filePath);
    try {
        // Upload the file and metadata
        const response = await fileRef.put(path.originFileObj);
        const url = await response.ref.getDownloadURL();
        return url;
    } catch (err) {
        console.log({ err });
    }
}

export function stringToHash(string) {
    var hash = 0;
    let i;
    let char;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash < 0 ? hash * -1 : hash;
}

export const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(" ").filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = "";
        name.split("").forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(" "));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};
