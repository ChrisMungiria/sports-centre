type Post = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  image?: string;
  category: number;
  created_by: string;
};

type Category = {
  id: number;
  created_at: Date;
  title: string;
  icon: string;
};
