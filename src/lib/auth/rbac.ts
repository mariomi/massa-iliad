export type AppRole = "admin" | "user" | "workforce" | "dipendente" | "agente";
export type StoreRole = "manager" | "staff" | "viewer" | null;

export function isAdmin(appRole?: AppRole | null) {
  return appRole === "admin";
}

export function canManageStores(appRole?: AppRole | null) {
  return isAdmin(appRole);
}

export function canEditPlanner(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  if (isWorkforce(appRole)) return false; // workforce can only view
  if (isDipendente(appRole) || isAgente(appRole)) return false; // dipendenti e agenti can only view
  return storeRole === "manager"; // managers edit planner; staff/viewer read-only
}

export function canRecordSales(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  if (isWorkforce(appRole)) return false; // workforce cannot record sales
  if (isDipendente(appRole) || isAgente(appRole)) return true; // dipendenti e agenti can record sales
  return storeRole === "manager" || storeRole === "staff"; // staff can record sales
}

export function canViewStore(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  return storeRole !== null; // any membership can view
}

export function isWorkforce(appRole?: AppRole | null) {
  return appRole === "workforce";
}

export function isDipendente(appRole?: AppRole | null) {
  return appRole === "dipendente";
}

export function isAgente(appRole?: AppRole | null) {
  return appRole === "agente";
}

export function canViewShifts(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  if (isWorkforce(appRole)) return true; // workforce can view shifts
  if (isDipendente(appRole) || isAgente(appRole)) return true; // dipendenti e agenti can view shifts
  return storeRole !== null; // any store membership can view
}

export function canViewTimeEntries(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  if (isWorkforce(appRole)) return true; // workforce can view time entries
  if (isDipendente(appRole) || isAgente(appRole)) return true; // dipendenti e agenti can view time entries
  return storeRole !== null; // any store membership can view
}

