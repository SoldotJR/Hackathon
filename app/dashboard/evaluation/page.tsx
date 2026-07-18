import { redirect } from "next/navigation";

export default function EvaluationRedirect() {
  redirect("/dashboard/recruitment?tab=evaluation");
}
