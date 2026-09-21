import Counter from "../components/counter/Counter";
import { Suspense } from "react";
import CounterSkeleton from "../components/counter/CounterSkeleton";
import LogoGenerator from "@/components/LogoGenerator";
import Footer from "./footer";
import MessageDisplay from "@/components/message_manager/MessageDisplay";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="w-full">
      <MessageDisplay />
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
