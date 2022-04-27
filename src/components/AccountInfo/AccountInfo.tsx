import React, { ReactElement, useEffect, useState } from "react";
import { getFirestore, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";

import { stringAvatar } from "../../styles/utils";
import { useUserStore } from "../../data/store";
import FullScreenLoadingSpinner from "../FullScreenLoadingSpinner";

const db = getFirestore();

export function AccountInfo(): ReactElement | null {
  const user = useUserStore((state) => state.user);
  const [date, setDate] = useState("");

  const [result, loading] = useDocumentData(doc(db, "users", user?.uid ?? ""));

  const getDate = () => {
    if (!date) {
      const date = new Date(result?.time.toDate());
      setDate(date.toLocaleDateString());
    }
  };

  useEffect(() => {
    if (result) {
      getDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  if (loading) {
    return <FullScreenLoadingSpinner loading={loading} />;
  }

  if (user && result)
    return (
      <Card>
        <CardMedia>
          <Avatar
            src={result.photoURL ?? ""}
            {...stringAvatar(user.displayName ?? "")}
          />
        </CardMedia>
        <CardContent>
          <CardHeader color="primary" title={user.displayName} />
          <Typography>Email: {user.email}</Typography>
          <Typography>Kijking cats since {date}</Typography>
        </CardContent>
      </Card>
    );

  return null;
}
