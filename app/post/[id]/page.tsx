// Next
import Image from "next/image";
import Link from "next/link";

// Actions
import {
  fetchComments,
  fetchPostCreator,
  getPostById,
  getPostImage,
} from "@/actions/post";
import { fetchCommentCreator } from "@/actions/comment";

// Date FNS
import { formatDistanceToNow, format } from "date-fns";

// Components
import AddCommentForm from "@/app/post/[id]/add-comment-form";
import { Button } from "@/components/ui/button";

// Supabase
import { createClient } from "@/utils/supabase/server";

interface Params {
  params: {
    id: string;
  };
}

const PostPage = async ({ params }: Params) => {
  const { id } = params;

  // Check if the user is logged in
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const { data: post, error } = await getPostById(id);
  const { data: postImage, error: getImageError } = await getPostImage(
    post?.[0]?.image
  );

  const { data: comments, error: commentsError } = await fetchComments(id);

  if (error) return <p className="text-red-500">Error fetching the post</p>;
  if (!post) return <p className="text-red-500">Post not found</p>;
  if (getImageError)
    return <p className="text-red-500">Error fetching the post image</p>;

  if (commentsError)
    return <p className="text-red-500">Error fetching the comments</p>;

  const renderCreatedAt = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);

    if (diffInDays < 1) {
      return `${formatDistanceToNow(createdDate)} ago`;
    } else {
      return format(createdDate, "MMM d, yyyy");
    }
  };

  const renderCommentCreator = async (creatorID: string) => {
    const data = await fetchCommentCreator(creatorID);
    if (!data) return;
    return data.display_name;
  };

  const getCreator = async () => {
    const data = await fetchPostCreator(post[0].created_by);
    if (!data) return;
    return data.display_name;
  };

  return (
    <div className="w-11/12 max-w-xl mx-auto space-y-4 relative">
      <h1 className="text-2xl font-semibold">{post[0].title}</h1>
      {postImage && (
        <Image
          priority
          unoptimized
          src={postImage.publicUrl}
          width={200}
          height={300}
          alt={post[0].title}
          className="w-full h-72 object-cover rounded-lg"
        />
      )}

      <div className="flex justify-between flex-col md:flex-row">
        <p className="font-semibold">Created by: {getCreator()}</p>
        <p className="text-slate-500 text-sm">
          {renderCreatedAt(post[0].created_at)}
        </p>
      </div>
      <p>{post[0].description}</p>

      <hr className="" />
      <h2 className="text-xl font-semibold text-slate-600">Comments</h2>
      {comments && comments?.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="border-b p-2">
            <h1>{comment.comment}</h1>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <p>{renderCreatedAt(comment.created_at)}</p>
              <p>Comment by: {renderCommentCreator(comment.created_by)}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-slate-500">
          No comments yet. Be the first to comment.
        </p>
      )}
      {user ? (
        <AddCommentForm postId={id} />
      ) : (
        <div className="p-2 border shadow-lg rounded py-6 w-3/4 mx-auto">
          <p className="text-slate-500 text-center">
            Log in or create an account to comment.
          </p>
          <div className="flex flex-col items-center justify-between w-3/4 mx-auto mt-4">
            <Button asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/auth/login">Create an account</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
