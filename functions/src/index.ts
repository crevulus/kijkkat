import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const vision = require("@google-cloud/vision");

admin.initializeApp();

exports.checkForCats = functions
  .region("europe-west1")
  .storage.bucket("cats")
  .object()
  .onFinalize(async (object) => {
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(
      `gs://${object.bucket}/${object.name}`
    );
    console.log(result);
    const labels = result.labelAnnotations;
    console.log("Labels:");
    labels.forEach((label: any) => console.log(label.description));
  });
