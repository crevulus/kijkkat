import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const vision = require("@google-cloud/vision");

admin.initializeApp();

type LabelType = {
  description: string;
} & { [key: string]: unknown };

enum SafeSearchLikelihoods {
  UNKNOWN = "UNKNOWN",
  VERY_UNLIKELY = "VERY_UNLIKELY",
  UNLIKELY = "UNLIKELY",
  POSSIBLE = "POSSIBLE",
  LIKELY = "LIKELY",
  VERY_LIKELY = "VERY_LIKELY",
}

const catLabelsArray = [
  "cat",
  "cats",
  "kitten",
  "kittens",
  "siamese",
  "felidae",
  "small to medium-sized cats",
];

// blur images: https://github.com/firebase/functions-samples/blob/main/moderate-images/functions/index.js

exports.checkForCats = functions
  .region("europe-west1")
  .storage.object()
  .onFinalize(async (object) => {
    const fileNameWithPath = object.name;
    const fileSlug = fileNameWithPath?.match(/[ \w-]+?(?=\.)/gi)?.[0];
    const userId = fileNameWithPath?.split("/")[1];
    if (!fileSlug || fileNameWithPath?.indexOf("/resizes") !== -1) {
      console.warn("No fileSlug present!");
      return;
    }
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(
      `gs://${object.bucket}/${fileNameWithPath}`
    );
    const [safeSearchResult] = await client.safeSearchDetection(
      `gs://${object.bucket}/${fileNameWithPath}`
    );
    const labels = result.labelAnnotations;
    const safeSearchLabels = safeSearchResult.safeSearchAnnotation;
    const isCat = labels.some(
      (label: LabelType) =>
        catLabelsArray.indexOf(label.description.toLowerCase()) >= 0
    );
    const isNSFW =
      Object.values(safeSearchLabels).includes(
        SafeSearchLikelihoods.VERY_LIKELY
      ) ||
      Object.values(safeSearchLabels).includes(SafeSearchLikelihoods.LIKELY);
    const batch = admin.firestore().batch();
    const originalPostDocRef = admin
      .firestore()
      .collection("posts")
      .doc(fileSlug);
    if (isNSFW && userId) {
      functions.logger.log(`NSFW detected: ${userId}, ${fileSlug}`);
      const nsfwDocRef = admin.firestore().collection("nsfw").doc(userId);
      batch.set(
        nsfwDocRef,
        {
          [fileSlug]: {
            name: fileSlug,
            time: admin.firestore.Timestamp.now(),
            location: `gs://${object.bucket}/${fileNameWithPath}`,
          },
        },
        { merge: true }
      );
      batch.set(originalPostDocRef, { isNSFW }, { merge: true });
    }
    if (!isCat && userId) {
      functions.logger.log(`Not a cat: ${userId}, ${fileSlug}`);
      const dubiousDocRef = admin.firestore().collection("dubious").doc(userId);
      batch.set(
        dubiousDocRef,
        {
          [fileSlug]: {
            name: fileSlug,
            time: admin.firestore.Timestamp.now(),
            location: `gs://${object.bucket}/${fileNameWithPath}`,
          },
        },
        { merge: true }
      );
    }
    return batch
      .commit()
      .then(() => functions.logger.log(`Batched: ${fileNameWithPath}`));
  });

exports.createUserFromGoogle = functions
  .region("europe-west1")
  .auth.user()
  .onCreate((user) => {
    if (user.providerData[0].providerId === "google.com") {
      return admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          email: user.providerData[0].email ?? "",
          displayName: user.providerData[0].displayName ?? "",
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId ?? "",
          time: admin.firestore.Timestamp.now(),
        });
    } else return;
  });

exports.likePost = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You've got to be logged in to do that!"
      );
    }
    const batch = admin.firestore().batch();
    const postRef = admin.firestore().collection("posts").doc(data.postId);
    batch.update(postRef, {
      likes: admin.firestore.FieldValue.increment(1),
      likedBy: admin.firestore.FieldValue.arrayUnion(context.auth.uid),
    });
    return batch.commit();
  });
