import { redirect } from "next/navigation";

export default function FollowUpRedirect() {
  redirect("/dashboard/automation?tab=followup");
}
