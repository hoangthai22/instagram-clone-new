import firebase, { db } from "../firebase/config";

export const handleLikeCard = (postId, uid, displayName, photoURL) => {
    console.log("postId, uid: ", postId, uid);
    db.collection("post")
        .where("postId", "==", postId)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                let listLiked = doc.data().userLiked;

                db.collection("post")
                    .doc(doc.id)
                    .update({
                        userLiked:
                            listLiked.length > 0
                                ? [...listLiked, { uid, displayName, photoURL, createdAtLike: firebase.firestore.Timestamp.now() }]
                                : [{ uid, displayName, photoURL, createdAtLike: firebase.firestore.Timestamp.now() }],
                    });
            });
        });
};
export const handleUnLikeCard = (postId, uid) => {
    db.collection("post")
        .where("postId", "==", postId)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                let listLiked = doc.data().userLiked;
                listLiked = listLiked.filter((item) => {
                    return item.uid !== uid;
                });
                db.collection("post")
                    .doc(doc.id)
                    .update({
                        userLiked: [...listLiked],
                    });
            });
        });
};
