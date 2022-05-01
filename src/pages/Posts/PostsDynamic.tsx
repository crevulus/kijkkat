import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, DocumentData, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { useDocumentData, useDocument } from "react-firebase-hooks/firestore";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import ThumbUp from "@mui/icons-material/ThumbUp";

import { FullScreenLoadingSpinner, RatingPicker } from "../../components";
import { useGeocoder } from "../../hooks/useGeocoder";
import { useErrorStore } from "../../data/store";
import { firebaseApp } from "../../firebase";
import { NavigationRoutes } from "../../data/enums";

const auth = getAuth();
const db = getFirestore();
const functions = getFunctions(firebaseApp, "europe-west1");
const likePost = httpsCallable(functions, "likePost");

const CustomisedIconButton = styled(IconButton)(({ theme }) => ({
  "&.Mui-disabled": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

export interface TagsType {
  id: number;
  text: string;
}

// TODO: Error handling
export function PostsDynamic({ id }: { id: string }) {
  const setError = useErrorStore((state) => state.setError);
  const setErrorMessage = useErrorStore((state) => state.setErrorMessage);

  const [data, setData] = useState<DocumentData>();
  const [date, setDate] = useState("");
  const [address, setAddress] = useState<string>();
  const [tags, setTags] = useState<TagsType[] | null>(null);
  const [liked, setLiked] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(false);

  const { geocodeAddressFromCoords } = useGeocoder();

  const [tagsDocData] = useDocumentData(doc(db, "tags", "appearance"));
  const [result, loading] = useDocument(doc(db, "posts", id));
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!data) {
      return;
    }
    if (!data.likes || data.likedBy.length < 1) {
      return;
    }
    setLiked(data.likedBy.includes(auth.currentUser?.uid));
  }, [data]);

  const getAddress = async () => {
    if (!address) {
      const result = await geocodeAddressFromCoords(data?.location);
      setAddress(result);
    }
  };

  const getDate = () => {
    if (!date) {
      const date = new Date(data?.time.toDate());
      setDate(date.toLocaleDateString());
    }
  };

  const findTags = useCallback(() => {
    if (tagsDocData) {
      const tagsArray = data?.tags.map((tag: number) => {
        return tagsDocData.tags.find((t: any) => t.id === tag);
      });
      return tagsArray;
    }
  }, [tagsDocData, data?.tags]);

  const handleLocationClick = () => {
    if (data?.location) {
      const params = `lat=${data.location.latitude}&lng=${data.location.longitude}`;
      navigate(`${NavigationRoutes.Map}?${params}`);
    }
  };

  const handleLike = () => {
    setLoadingLiked(true);
    if (data && data.likedBy.includes(auth.currentUser?.uid)) {
      setLoadingLiked(false);
      return;
    }
    likePost({ postId: id }).catch((error) => {
      setError(true);
      setErrorMessage(error.message);
    });
    setLoadingLiked(false);
  };

  if (loading) <FullScreenLoadingSpinner loading={loading} />;

  return (
    <Container sx={{ p: 2 }}>
      <Card sx={{ maxWidth: "100%" }}>
        {address && (
          <CardContent>
            <IconButton onClick={handleLocationClick}>
              <LocationOn color="primary" />
            </IconButton>
            <Typography variant="body2" onClick={handleLocationClick}>
              {address}
            </Typography>
          </CardContent>
        )}{" "}
        <CardMedia
          component="img"
          image={data?.imageUrl}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            {loadingLiked ? (
              <CircularProgress />
            ) : (
              <>
                <CustomisedIconButton
                  disabled={liked || loadingLiked}
                  color={liked ? "primary" : "default"}
                  aria-label="Like this cat"
                  onClick={handleLike}
                >
                  <ThumbUp />
                </CustomisedIconButton>
                <Typography
                  pr={1}
                  variant="body2"
                  color={liked ? "primary" : "default"}
                >
                  {data?.likes}
                </Typography>
              </>
            )}
          </Box>
          <Typography pr={1} variant="body1">
            {date} by {data?.userName ?? "Anonymous"}
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
}
