"use client";

// Next
import Link from "next/link";
import Image from "next/image";

// React
import { useEffect, useMemo, useState } from "react";

// Date FNS
import { formatDistanceToNow, format } from "date-fns";

// Actions
import { fetchAllPosts, getPostImage } from "@/actions/post";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Loading skeleton
import PostsLoadingSkeleton from "../loading-skeletons/posts-loading-skeleton";

// Props
type BlogListProps = {
  selectedCategory: Category | null | undefined;
};

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
  const truncateDescription = (
    description: string,
    wordLimit: number
  ): string => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  useEffect(() => {
    if (post.image) {
      const getPostImageHandler = async () => {
        const { data, error } = await getPostImage(post.image!);
        if (data) {
          setImageUrl(data.publicUrl);
        } else if (error) {
          console.log("Error fetching post image: ", error);
        }
      };

      getPostImageHandler();
    }
  }, [post.image]);

  return (
    <Card className="max-w-xs mx-auto group">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          <p>{renderCreatedAt(post.created_at)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {post.image && imageUrl ? (
          <Image
            priority
            unoptimized
            src={imageUrl}
            width={200}
            height={300}
            alt={post.title}
            className="w-full h-56 object-cover rounded-lg"
          />
        ) : null}
        <p>{truncateDescription(post.description, 24)}</p>
      </CardContent>
      <CardFooter>
        {/* TODO: Link this to a page containing the full post */}
        <Link href={"/"}>Read more</Link>
      </CardFooter>
    </Card>
  );
};

const BlogList = ({ selectedCategory }: BlogListProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPostsFn = async () => {
    try {
      const { data, error } = await fetchAllPosts();
      if (error) {
        setError(error);
      } else if (data) {
        setPosts(data);
      }
    } catch (error) {
      setError("Error fetching posts");
      console.log("Error fetching posts in BlogList: ", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = useMemo(() => {
    if (selectedCategory && selectedCategory.id) {
      return posts.filter((post) => post.category === selectedCategory.id);
    } else {
      return posts;
    }
  }, [selectedCategory, posts]);

  useEffect(() => {
    fetchAllPostsFn();
  }, []);

  return (
    <div className="space-y-2 mt-4 overflow-y-scroll">
      {loading ? (
        <PostsLoadingSkeleton />
      ) : error ? (
        <p>{error}</p>
      ) : filterPosts.length > 0 ? (
        filterPosts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div className="w-full p-4 rounded-md">
          <p className="text-center text-slate-500">
            No posts for this category
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
