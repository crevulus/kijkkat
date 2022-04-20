import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { firebaseApp } from "../firebase";

export const useImageFromFirebase = (urlString: string) => {
  const storage = getStorage(firebaseApp);
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const trimFilepath = (filepath: string) => {
    return filepath.replace("gs://kijkkat-meow.appspot.com/", "");
  };

  const storageRef = ref(storage, trimFilepath(urlString));

  useEffect(() => {
    console.log("Running: useImageFromFirebase");
    const getImage = async () => {
      await getDownloadURL(storageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => setErrorMsg(error.message));
    };
    getImage();
  }, [urlString]);

  return [imageUrl, errorMsg];
};
