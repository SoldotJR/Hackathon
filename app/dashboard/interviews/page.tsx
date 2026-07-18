import { redirect } from "next/navigation";

export default function InterviewsRedirect() {
  redirect("/dashboard/recruitment?tab=interview");
}
