import { Toaster } from "@/components/ui/toaster";

export default function AddPostLayout({
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
