import { getCount } from "@/lib/db";

export default async function Counter() {
  const counter = " " + getCount() + " ";
  return (
    <div>
      <p className="counter font-semibold" id="counter">
        The community has already generated
        <span className="counter-value text-red font-bold">{counter}</span>
        logos with this app
      </p>
    </div>
  );
}
