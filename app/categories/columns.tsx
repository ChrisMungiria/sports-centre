"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { deleteCategory } from "@/actions/category";
import Link from "next/link";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = date.toLocaleString();
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "icon",
    header: "Icon",
  },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const rowID = row.original.id;
      return (
        <Button asChild variant={"link"}>
          <Link href={`/categories/edit/${rowID}`}>Edit</Link>
        </Button>
      );
    },
  },

  {
    id: "delete",
    header: "Delete",
    cell: async ({ row }) => {
      const rowID = row.original.id;
      const handleDelete = async () => {
        try {
          const error = await deleteCategory(rowID);
          if (error) {
            alert(error.error);
          }
        } catch (error) {
          console.log("Error in handleDelete: ", error);
        }
      };
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"destructive"}>Delete</Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-3">
            <h1 className="text-xs font-semibold">
              Are you sure you want to delete {row.original.title}
            </h1>
            <div className="flex items-center justify-between">
              <PopoverClose asChild>
                <Button size={"sm"} variant={"outline"}>
                  Cancel
                </Button>
              </PopoverClose>
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
