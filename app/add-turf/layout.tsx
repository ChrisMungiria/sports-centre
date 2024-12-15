import { Toaster } from "@/components/ui/toaster";

export default function AddTurfLayout({
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
