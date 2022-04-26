import { useParams } from "react-router-dom";

import { PostsDynamic } from "./PostsDynamic";
import { PostsDefault } from "./PostsDefault";

export function Posts() {
  const { id } = useParams();

  if (id) {
    return <PostsDynamic id={id} />;
  }

  return (
    <>
      <PostsDefault />
    </>
  );
}
