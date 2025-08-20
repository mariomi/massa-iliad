"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { SalesForm } from "@/components/sales/SalesForm";
export default function NewSalePage() {
  const { storeId } = useParams<{ storeId: string }>();
  return (<><PageHeader title="Nuova vendita" /><SalesForm storeId={storeId} /></>);
}
