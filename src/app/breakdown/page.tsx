import type { Metadata } from "next";
import BreakdownTable from "@/components/BreakdownTable";

export const metadata: Metadata = {
  title: "Full Breakdown — College Hub",
};

export default function BreakdownPage() {
  return (
    <div className="page">
      <p className="hero__overline">every column, one table</p>
      <h1>
        The Full <em>Breakdown</em>.
      </h1>
      <p className="page__sub">
        The whole spreadsheet, sortable. Click any column header to re-rank —
        cut schools sit greyed out wherever they land.
      </p>
      <BreakdownTable />
    </div>
  );
}
