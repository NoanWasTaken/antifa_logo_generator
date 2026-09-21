import { getMessage } from "@/lib/db";
import MessageWrapper from "./MessageWrapper";

export default function MessageDisplay() {
  const message = getMessage();

  if (!message.active || !message.value?.trim()) return null;

  return (
    <MessageWrapper message={message.value}>
      <p className="m-0">{message.value}</p>
    </MessageWrapper>
  );
}
