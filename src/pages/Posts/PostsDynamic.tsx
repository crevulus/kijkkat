import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, DocumentData, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Icon,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import ThumbUp from "@mui/icons-material/ThumbUp";
import CancelIcon from "@mui/icons-material/Cancel";

import { FullScreenLoadingSpinner, RatingPicker } from "../../components";
import { TagsType, useErrorStore, useSiteDataStore } from "../../data/store";
import { firebaseApp } from "../../firebase";
import { NavigationRoutes } from "../../data/enums";
import { postsStyles } from "../Pages.styles";
import MainImage from "../../components/MainImage";
import { useCheckSignedIn } from "../../hooks/useCheckSignedIn";
import { SignInDialog } from "../../components/utils/SignInDialog";

const auth = getAuth();
const db = getFirestore();
const functions = getFunctions(firebaseApp, "europe-west1");
const likePost = httpsCallable(functions, "likePost");

const DIALOG_MESSAGE_ACTION = "like pictures";

const CustomisedIconButton = styled(IconButton)(({ theme }) => ({
  "&.Mui-disabled": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

// TODO: Error handling
export function PostsDynamic({ id }: { id: string }) {
  const setError = useErrorStore((state) => state.setError);
  const tagsDocData = useSiteDataStore((state) => state.tagsDocData);
  const { showAlert, setShowAlert, checkSignedIn } = useCheckSignedIn();

  const [data, setData] = useState<DocumentData>();
  const [date, setDate] = useState("");
  const [liked, setLiked] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [tags, setTags] = useState<TagsType[]>([]);

  const [result, loading] = useDocument(doc(db, "posts", id));
  const [likesData] = useDocument(
    doc(db, "users", auth.currentUser?.uid ?? "", "likes", id)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (result && !result?.exists()) {
      navigate(NavigationRoutes.NotFound);
    }
    if (result) {
      setData(result.data());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    if (data) {
      getDate();
      setTags(findTags());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (!data.likes || !likesData) {
      return;
    }
    setLiked(likesData?.exists());
  }, [data, likesData]);

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
      const zoom = 15;
      navigate(`${NavigationRoutes.Map}?${params}&zoom=${zoom}`);
    }
  };

  const handleLike = async () => {
    setLoadingLiked(true);
    if (!checkSignedIn()) {
      setLoadingLiked(false);
      setShowAlert(true);
      return;
    }
    if (data && data.likedBy.includes(auth.currentUser?.uid)) {
      setLoadingLiked(false);
      return;
    }
    await likePost({ postId: id }).catch((error) => {
      setError(true, error.message);
    });
    setLoadingLiked(false);
  };

  if (loading) <FullScreenLoadingSpinner loading={loading} />;

  if (data?.isNSFW) {
    return (
      <Container sx={postsStyles.postsDynamic.nsfwContainer}>
        <Icon color="error">
          <CancelIcon />
        </Icon>
      </Container>
    );
  }

  return (
    <Container sx={postsStyles.postsDynamic.container}>
      <SignInDialog
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        message={DIALOG_MESSAGE_ACTION}
      />
      <Card sx={postsStyles.postsDynamic.card}>
        {data?.address && (
          <CardContent>
            <IconButton onClick={handleLocationClick}>
              <LocationOn color="primary" />
            </IconButton>
            <Typography variant="body2" onClick={handleLocationClick}>
              {data?.address}
            </Typography>
          </CardContent>
        )}{" "}
        {data?.thumbnailUrlWebpLarge && (
          <MainImage
            webpUrl={data.thumbnailUrlWebpLarge}
            jpegUrl={data.thumbnailUrlJpegLarge}
            fallbackUrl={data.imageUrl}
          />
        )}
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
        <CardActions sx={postsStyles.postsDynamic.cardActions}>
          <Box sx={postsStyles.postsDynamic.box}>
            {loadingLiked ? (
              <CircularProgress color="secondary" />
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
