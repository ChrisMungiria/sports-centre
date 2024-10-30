"use client";

// React
import { useEffect, useMemo, useState } from "react";

// Date FNS
import { formatDistanceToNow, format } from "date-fns";

// Actions
import { fetchAllPosts } from "@/actions/post";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Props
type BlogListProps = {
  selectedCategory: Category | null | undefined;
};

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
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

  return (
    <Card className="max-w-xs mx-auto">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          <p>{renderCreatedAt(post.created_at)}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        // sort the posts by created_at in descending order
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
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
        <p>Loading...</p>
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
