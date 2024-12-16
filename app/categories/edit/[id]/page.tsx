import { fetchCategoryById } from "@/actions/category";
import CategoryForm from "../../category-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const category = await fetchCategoryById(parseInt(id));

  if (!category) return <p>Error fetching category</p>;
  return <CategoryForm category={category[0]} />;
}
