import { Toaster } from "@/components/ui/toaster";

export default function AddCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
}
