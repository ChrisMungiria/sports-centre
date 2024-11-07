// Next
import Image from "next/image";

// Actions
import { getPostById, getPostImage } from "@/actions/post";

// Date FNS
import { formatDistanceToNow, format } from "date-fns";

interface Params {
  params: {
    id: string;
  };
}

const PostPage = async ({ params }: Params) => {
  const { id } = params;

  const { data: post, error } = await getPostById(id);
  const { data: postImage, error: getImageError } = await getPostImage(
    post?.[0]?.image
  );

  if (error) return <p className="text-red-500">Error fetching the post</p>;
  if (!post) return <p className="text-red-500">Post not found</p>;
  if (getImageError)
    return <p className="text-red-500">Error fetching the post image</p>;

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

  return (
    <div className="w-11/12 max-w-xl mx-auto space-y-4">
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
        {/* TODO: Fetch the user who created the post from the public user's table */}
        <p className="font-semibold">Created by:</p>
        <p className="text-slate-500 text-sm">
          {renderCreatedAt(post[0].created_at)}
        </p>
      </div>
      <p>{post[0].description}</p>
    </div>
  );
};

export default PostPage;
