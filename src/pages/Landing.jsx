import { Button } from "@/components/ui/coss-button";
import BlurText from "@/components/ui/blur-text";
import Grainient from "@/components/Grainient";

export default function Landing({ onSignIn, onSignUp }) {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B497CF"
          warpAmplitude={30}
          zoom={0.8}
        />
      </div>

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-background/50 backdrop-blur-[1px]" />

      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 bg-transparent">
        <div className="flex items-center">
          <span className="text-2xl text-white tracking-[0.5px] drop-shadow-sm">
            <span className="font-normal">Fork</span>
            <span className="font-extrabold">Cast</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onSignIn}
            className="font-semibold text-primary hover:bg-primary/10"
          >
            Sign in
          </Button>
          <Button
            variant="default"
            onClick={onSignUp}
            className="font-semibold bg-black text-white hover:bg-black/90 border-black rounded-full px-6"
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center max-w-3xl mx-auto">
        <div className="mt-12 w-full flex flex-col items-center">
          <div className="flex flex-col items-center justify-center space-y-6">


            <BlurText
              text="Eat good. Spend less. No adulting required."
              delay={100}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary drop-shadow-sm justify-center text-center leading-[1.1]"
            />
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Stop eating the same 3 things. Plan your week in minutes, spend
              less, actually enjoy food.
            </p>
          </div>
          <div className="pt-8 flex flex-col items-center space-y-3 w-full">
            <Button
              size="xl"
              onClick={onSignUp}
              className="w-full sm:w-auto font-semibold bg-white text-[#000000] hover:bg-white/90 rounded-full px-10 shadow-lg transition-transform hover:-translate-y-1 text-lg h-14"
            >
              Plan my week — it's free
            </Button>
            <div className="text-sm font-medium text-white/70 text-center">
               ✦ 12,000+ meals planned this week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
