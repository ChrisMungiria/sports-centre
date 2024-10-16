import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full h-fit p-4 fixed inset-0 border-b flex items-center justify-between z-50 backdrop-blur-sm">
      <h2 className="font-semibold text-lg">SportsCentre</h2>
      <Button asChild>
        <Link href="/auth/login">Sign in</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
