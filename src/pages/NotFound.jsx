import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="text-9xl mb-4">🍽️</div>
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Oops! It seems we dropped the ingredients for this page. Let's get you back to the kitchen.
        </p>
        <Button asChild size="lg" className="mt-4 rounded-full">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}
