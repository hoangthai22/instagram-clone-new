import firebase, { db } from "../firebase/config";

export const handleFollow = async (follow, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo) => {
    console.log({ follow });
    console.log({ user });
    await db
        .collection("users")
        .where("uid", "==", follow.uid)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                const listFollowerOld = doc.data()?.listFollower || [];
                db.collection("users")
                    .doc(doc.id)
                    .update({
                        listFollower:
                            listFollowerOld.length > 0
                                ? [{ uid: user.uid, createdAtFollow: firebase.firestore.Timestamp.now(), userRef: db.doc("users/" + user.id) }, ...listFollowerOld]
                                : [{ uid: user.uid, createdAtFollow: firebase.firestore.Timestamp.now(), userRef: db.doc("users/" + user.id) }],
                        nofication: false,
                    })
                    .then(() => {
                        if (Object.keys(profileFriendInfo).length !== 0) {
                            let newList = profileFriendInfo.info.listFollower;
                            newList = [{ uid: user.uid, createdAtFollow: firebase.firestore.Timestamp.now(), userRef: db.doc("users/" + user.id) }].concat(newList);
                            // newList.push({ uid: user.uid, createdAtFollow: firebase.firestore.Timestamp.now(), userRef: db.doc("users/" + user.id) });

                            let profile = {
                                info: { ...profileFriendInfo.info, listFollower: newList },
                                posts: profileFriendInfo.posts,
                            };
                            setProfileFriendInfo(profile);
                        }
                    });
            });
        });
    await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                const listFollowOld = doc.data().listFollow || [];
                db.collection("users")
                    .doc(doc.id)
                    .update({
                        listFollow:
                            listFollowOld.length > 0
                                ? [
                                      {
                                          uid: follow.uid,
                                          userRef: db.doc("users/" + follow.id),
                                          createdAtFollow: firebase.firestore.Timestamp.now(),
                                      },
                                      ...listFollowOld,
                                  ]
                                : [{ uid: follow.uid, userRef: db.doc("users/" + follow.id), createdAtFollow: firebase.firestore.Timestamp.now() }],
                    })
                    .then(() => {
                        if (Object.keys(profileInfo).length !== 0) {
                            let newList = profileInfo.info.listFollow;
                            newList = [{ uid: follow.uid, createdAtFollow: firebase.firestore.Timestamp.now(), userRef: db.doc("users/" + follow.id) }].concat(newList);

                            let profile = {
                                info: { ...profileInfo.info, listFollow: newList },
                                posts: profileInfo.posts,
                            };
                            console.log({ profile });
                            setProfileInfo(profile);
                        }
                    });
            });
        });
};

export const handleCancelFollow = async (follow, user, profileInfo, setProfileInfo, profileFriendInfo, setProfileFriendInfo) => {
    console.log("follow", follow);
    console.log("user", user);
    await db
        .collection("users")
        .where("uid", "==", follow.uid)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                let listFollowerOld = doc.data().listFollower;
                listFollowerOld = listFollowerOld.filter((id) => id.uid !== user.uid);
                db.collection("users")
                    .doc(doc.id)
                    .update({ listFollower: [...listFollowerOld] });
            });
        })
        .then(() => {
            if (Object.keys(profileFriendInfo).length !== 0) {
                let newList = profileFriendInfo.info.listFollower;
                newList = newList.filter((i) => i.uid !== user.uid);

                let profile = {
                    info: { ...profileFriendInfo.info, listFollower: newList },
                    posts: profileFriendInfo.posts,
                };
                setProfileFriendInfo(profile);
            }
        });
    await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => {
                let listFollowOld = doc.data().listFollow;
                listFollowOld = listFollowOld.filter((id) => id.uid !== follow.uid);
                db.collection("users")
                    .doc(doc.id)
                    .update({ listFollow: [...listFollowOld] });
            });
        })
        .then(() => {
            if (Object.keys(profileInfo).length !== 0) {
                let newList = profileInfo.info.listFollow;
                newList = newList.filter((i) => i.uid !== follow.uid);

                let profile = {
                    info: { ...profileInfo.info, listFollow: newList },
                    posts: profileInfo.posts,
                };
                setProfileInfo(profile);
            }
        });
};
