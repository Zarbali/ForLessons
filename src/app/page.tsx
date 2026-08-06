import { Hero } from "@/components/home/Hero";
import { MotivationBanner } from "@/components/home/MotivationBanner";
import { DailyWord } from "@/components/home/DailyWord";
import { DailyQuote } from "@/components/home/DailyQuote";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="page-enter mx-auto mt-8 w-full max-w-3xl space-y-5 px-4 pb-10 sm:mt-12 sm:px-6">
        <MotivationBanner />
        <div className="grid gap-5 md:grid-cols-2">
          <DailyWord />
          <DailyQuote />
        </div>
      </section>
    </>
  );
}
