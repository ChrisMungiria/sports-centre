"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
import { User } from "@supabase/supabase-js";
import { signOut } from "@/actions";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

type NavbarProps = {
  user: User | null;
};

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <nav className="w-full h-fit p-4 fixed inset-0 border-b flex items-center justify-between z-50 backdrop-blur-sm">
      <h2 className="font-semibold text-lg">SportsCentre</h2>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        {!pathname.includes("/auth") ? (
          user ? (
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

                <p className="text-sm">
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
