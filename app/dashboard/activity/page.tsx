import { redirect } from "next/navigation";

export default function ActivityRedirect() {
  redirect("/dashboard/automation?tab=timeline");
}
