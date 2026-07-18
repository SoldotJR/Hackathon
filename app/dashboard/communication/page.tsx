import { redirect } from "next/navigation";

export default function CommunicationRedirect() {
  redirect("/dashboard/automation?tab=communication");
}
