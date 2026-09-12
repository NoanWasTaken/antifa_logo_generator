import Counter from "../components/counter/Counter";
import { Suspense } from "react";
import CounterSkeleton from "../components/counter/CounterSkeleton";
import LogoGenerator from "@/components/LogoGenerator";
import Footer from "./footer";

export default async function Home() {
  return (
    <div>
      <main>
        <Suspense fallback={<CounterSkeleton />}>
          <Counter />
        </Suspense>
        <LogoGenerator />
      </main>
      <Footer />
    </div>
  );
}
