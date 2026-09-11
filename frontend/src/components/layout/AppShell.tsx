import type { ReactNode } from "react";
import { HeartPulse, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CollaboratingPartner } from "@/components/common/CollaboratingPartner";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { useSession } from "@/hooks/useSession";

function SignedOut() {
  const { signIn, user } = useSession();
  return (
    <div className="clinical-canvas flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
        <div className="border-b border-border bg-primary/5 px-6 py-5 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="size-6" aria-hidden />
          </span>
          <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">ClinicalFlow AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">Secure clinical care workspace</p>
        </div>
        <div className="space-y-5 px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Session ended. Authentication is handled by Amazon Cognito in production; this demo uses a mock
            session.
          </p>
          <Button className="w-full" size="lg" onClick={signIn}>
            Sign back in as {user.name}
          </Button>
          <CollaboratingPartner variant="auth" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { signedIn } = useSession();
  if (!signedIn) return <SignedOut />;

  return (
    <div className="clinical-canvas flex min-h-screen w-full">
      <div className="sticky top-0 hidden h-screen lg:block">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-surface/90 px-3 py-2 backdrop-blur-sm lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-0 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <HeartPulse className="size-4 text-primary" aria-hidden />
            ClinicalFlow AI
          </span>
          <div className="ml-auto">
            <CollaboratingPartner variant="inline" />
          </div>
        </div>
        <TopHeader />
        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
        <CollaboratingPartner variant="footer" />
      </div>
    </div>
  );
}
