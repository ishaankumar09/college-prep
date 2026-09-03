import type { Metadata } from "next";
import ChecklistClient from "@/components/ChecklistClient";

export const metadata: Metadata = {
  title: "Checklist — College Hub",
};

export default function ChecklistPage() {
  return <ChecklistClient />;
}
