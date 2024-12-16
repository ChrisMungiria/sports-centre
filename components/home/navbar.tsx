"use client";

// Next
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// React
import { useEffect } from "react";

// Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";

// Types
import { User } from "@supabase/supabase-js";

// Actions
import { addUserToDatabase, signOut } from "@/actions/auth";

type NavbarProps = {
  user: User | null;
  role: number | undefined | null;
};

const Navbar = ({ user, role }: NavbarProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      addUserToDatabase(user);
    }
  }, [user]);

  return (
    <nav className="w-full h-fit p-4 fixed inset-0 border-b flex items-center justify-between z-50 backdrop-blur-sm bg-white/80 dark:bg-black/80">
      <h2 className="font-semibold text-lg">
        <Link href={"/"}>SportsCentre</Link>
      </h2>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        {!pathname.includes("/auth") ? (
          user ? (
            <>
              {role && role === 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <Button>Manage</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={"/categories"} className="w-full h-full">
                        Categories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={"/add-post"} className="w-full h-full">
                        Add Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={"/add-turf"} className="w-full h-full">
                        Add Turf
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger className="border p-2 rounded-md flex items-center gap-2 focus:outline-none">
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={`${user.user_metadata.avatar_url}`}
                      alt="avatar"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                  ) : null}
                  <p className="text-xs">
                    {user.user_metadata.display_name
                      ? user.user_metadata.display_name
                      : user.user_metadata.full_name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    {/* TODO: Add a link for viewing profile */}
                    <p>View profile</p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Button
                    variant={"destructive"}
                    className="w-full"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign out
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
