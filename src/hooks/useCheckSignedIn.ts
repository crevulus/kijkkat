import { useState } from "react";
import { useUserStore } from "../data/store";

export const useCheckSignedIn = () => {
  const isSignedIn = useUserStore((state) => state.isSignedIn);
  const [showAlert, setShowAlert] = useState(false);

  const checkSignedIn = () => {
    if (!isSignedIn) {
      setShowAlert(true);
    }
    return isSignedIn;
  };

  return { showAlert, setShowAlert, checkSignedIn };
};
