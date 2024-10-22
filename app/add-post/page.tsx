import { fetchAllCategories } from "@/actions/category";
import AddPostForm from "./add-post-form";

const page = async () => {
  const { data } = await fetchAllCategories();
  return (
    <div>
      <AddPostForm data={data} />
    </div>
  );
};

export default page;
