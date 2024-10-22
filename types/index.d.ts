type Post = {
  id: number;
  title: string;
  description: string;
  category: Category;
  createdAt: Date;
  image?: string;
  postRef?: string;
};

type Category = {
  id: number;
  created_at: Date;
  title: string;
  icon: string;
};
