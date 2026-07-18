import { redirect } from "next/navigation";

export default function WorkflowRedirect() {
  redirect("/dashboard/automation?tab=workflow");
}
