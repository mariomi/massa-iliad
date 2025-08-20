"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlannerCalendar } from "@/components/planner/PlannerCalendar";
export default function PlannerPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const canEdit = true;
  return (<><PageHeader title="Planner turni" desc="Crea e gestisci i turni per il punto vendita" /><PlannerCalendar storeId={storeId} canEdit={canEdit} /></>);
}
