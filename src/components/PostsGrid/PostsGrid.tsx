import React, { ReactElement } from "react";

import { ImageList } from "@mui/material";

import PostsGridItem from "./PostsGridItem";

type PostsGridPropsType = {
  data: Record<string, any>[];
};

export function PostsGrid({ data }: PostsGridPropsType): ReactElement {
  return (
    <ImageList sx={{ width: "100%" }} cols={3} rowHeight="auto">
      {/* @ts-ignore */}
      {data.map((item) => (
        <PostsGridItem item={item} key={item.timestamp} />
      ))}
    </ImageList>
  );
}
