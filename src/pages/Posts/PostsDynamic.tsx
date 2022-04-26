import { Fragment, useCallback, useEffect, useState } from "react";
import { doc, DocumentData, getFirestore } from "firebase/firestore";
import { useDocumentData, useDocument } from "react-firebase-hooks/firestore";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import Favorite from "@mui/icons-material/Favorite";

import { FullScreenLoadingSpinner, RatingPicker } from "../../components";
import { useGeocoder } from "../../hooks/useGeocoder";

const db = getFirestore();

export interface TagsType {
  id: number;
  text: string;
}

// TODO: Error handling
export function PostsDynamic({ id }: { id: string }) {
  const [data, setData] = useState<DocumentData>();
  const [date, setDate] = useState("");
  const [address, setAddress] = useState<string>();
  const [tags, setTags] = useState<TagsType[] | null>(null);

  const [tagsDocData] = useDocumentData(doc(db, "tags", "appearance"));
  const [result, loading] = useDocument(doc(db, "posts", id));

  const { geocodeAddressFromCoords } = useGeocoder();

  useEffect(() => {
    if (result) {
      setData(result.data());
    }
  }, [result]);

  useEffect(() => {
    if (data) {
      getAddress();
      getDate();
      setTags(findTags());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getAddress = async () => {
    const result = await geocodeAddressFromCoords(data?.location);
    setAddress(result);
  };

  const getDate = () => {
    const date = new Date(data?.time.toDate());
    setDate(date.toLocaleDateString());
  };

  const findTags = useCallback(() => {
    if (tagsDocData) {
      const tagsArray = data?.tags.map((tag: number) => {
        return tagsDocData.tags.find((t: any) => t.id === tag);
      });
      return tagsArray;
    }
  }, [tagsDocData, data?.tags]);

  if (loading) <FullScreenLoadingSpinner loading={loading} />;

  return (
    <Container sx={{ p: 2 }}>
      <Card sx={{ maxWidth: "100%" }}>
        {data && (
          <Typography variant="body2" color="primary">
            User: {data.userId}
          </Typography>
        )}
        {address && (
          <CardContent>
            <LocationOn color="primary" />
            <Typography variant="body2">{address}</Typography>
          </CardContent>
        )}{" "}
        <CardMedia
          component="img"
          image={data?.imageUrl ?? ""}
          alt="Someone kijk'd a cat!"
          height={400}
        />
        <CardContent>
          {data &&
            Object.keys(data.rating).map((category, index) => {
              const ratingValue = data.rating[category];
              return (
                <Fragment key={category}>
                  <RatingPicker
                    ratingValue={ratingValue}
                    title={category}
                    readOnly
                  />
                  {index !== Object.keys(data.rating).length - 1 && <Divider />}
                </Fragment>
              );
            })}
          {tags && (
            <Stack direction="row" spacing={1}>
              {tags.map((tag: TagsType) => (
                <Chip key={tag.id} label={tag.text} color="secondary" />
              ))}
            </Stack>
          )}
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Fragment>
            <IconButton aria-label="Like this cat">
              <Favorite />
            </IconButton>
            <Typography pr={1} variant="body2">
              {data?.likes}
            </Typography>
          </Fragment>
          <Typography pr={1} variant="body2">
            {date}
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
}
