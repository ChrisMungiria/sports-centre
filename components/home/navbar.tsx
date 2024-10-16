"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full h-fit p-4 fixed inset-0 border-b flex items-center justify-between z-50 backdrop-blur-sm">
      <h2 className="font-semibold text-lg">SportsCentre</h2>
      {!pathname.includes("/auth") ? (
        <Button asChild>
          <Link href="/auth/login">Sign in</Link>
        </Button>
      ) : null}
    </nav>
  );
};

export default Navbar;
