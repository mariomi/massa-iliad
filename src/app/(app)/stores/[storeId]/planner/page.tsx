"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlannerCalendar } from "@/components/planner/PlannerCalendar";
import { useMe } from "@/lib/auth/useMe";
import { useStoreRole } from "@/lib/auth/useStoreRole";
import { canEditPlanner } from "@/lib/auth/rbac";
export default function PlannerPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { me } = useMe();
  const { role } = useStoreRole(storeId);
  const canEdit = canEditPlanner(me?.role ?? "user", role);
  return (<><PageHeader title="Planner turni" desc="Crea e gestisci i turni per il punto vendita" /><PlannerCalendar storeId={storeId} canEdit={canEdit} /></>);
}
