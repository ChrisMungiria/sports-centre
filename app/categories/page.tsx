import { fetchAllCategories } from "@/actions/category";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  // Fetch all categories and display in a table
  const { data, error } = await fetchAllCategories();

  if (error) return <p>Could not fetch categories: {error}</p>;
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h1 className="text-xl font-semibold">Manage categories</h1>
        <Button asChild variant={"outline"}>
          <Link href={"/categories/add"}>Add category</Link>
        </Button>
      </div>
      {data ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <p>No categories were found</p>
      )}
    </div>
  );
}
