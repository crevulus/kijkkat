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
    const fileName = object.name?.replace(" ", "_");
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(
      `gs://${object.bucket}/${fileName}`
    );
    const [safeSearchResult] = await client.safeSearchDetection(
      `gs://${object.bucket}/${fileName}`
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
    const folderName = fileName?.split("/")[1];
    if (isNSFW && folderName) {
      functions.logger.log(`NSFW detected: ${folderName}, ${fileName}`);
      const nsfwDocRef = admin.firestore().collection("nsfw").doc(folderName);
      batch.set(
        nsfwDocRef,
        {
          [object.id]: {
            name: fileName,
            time: admin.firestore.Timestamp.now(),
            location: `gs://${object.bucket}/${fileName}`,
          },
        },
        { merge: true }
      );
    }
    if (!isCat && folderName) {
      functions.logger.log(`Not a cat: ${folderName}, ${fileName}`);
      const dubiousDocRef = admin
        .firestore()
        .collection("dubious")
        .doc(folderName);
      batch.set(
        dubiousDocRef,
        {
          [object.generation ?? fileName ?? "unknown"]: {
            name: fileName,
            time: admin.firestore.Timestamp.now(),
            location: `gs://${object.bucket}/${fileName}`,
          },
        },
        { merge: true }
      );
    }
    return batch
      .commit()
      .then(() => functions.logger.log(`Batched: ${fileName}`));
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
