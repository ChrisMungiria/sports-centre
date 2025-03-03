type Post = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  image: string | null | undefined;
  category: number;
  created_by: string;
};

type Category = {
  id: number;
  created_at: string;
  title: string;
  icon: string | undefined | null;
};

type Comment = {
  id: number;
  created_at: Date;
  comment: string;
  created_by: string;
  post_id: number;
};
