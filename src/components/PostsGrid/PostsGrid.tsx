import React, { ReactElement } from "react";

import { ImageList } from "@mui/material";

import PostsGridItem from "./PostsGridItem";
import { DocsType } from "../../pages/Home";

type PostsGridPropsType = {
  data: DocsType[];
};

export function PostsGrid({ data }: PostsGridPropsType): ReactElement {
  return (
    <ImageList sx={{ width: "100%" }} cols={3} rowHeight="auto">
      {data.map((item) => (
        <PostsGridItem key={item.id} item={item} />
      ))}
    </ImageList>
  );
}
