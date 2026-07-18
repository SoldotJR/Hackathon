import { redirect } from "next/navigation";

export default function SchedulingRedirect() {
  redirect("/dashboard/recruitment?tab=interview");
}
