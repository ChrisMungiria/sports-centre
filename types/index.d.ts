type Post = {
  id: number;
  title: string;
  description: string;
  category: SportCategory;
  createdAt: Date;
  image?: string;
  postRef?: string;
};

type SportCategory = {
  id: number;
  icon: string;
  title: string;
  createdAt: Date;
};
