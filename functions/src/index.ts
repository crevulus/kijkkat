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

exports.checkForCats = functions
  .region("europe-west1")
  .storage.object()
  .onFinalize(async (object) => {
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(
      `gs://${object.bucket}/${object.name}`
    );
    const [safeSearchResult] = await client.safeSearchDetection(
      `gs://${object.bucket}/${object.name}`
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
    console.log({ isCat, isNSFW });
  });
