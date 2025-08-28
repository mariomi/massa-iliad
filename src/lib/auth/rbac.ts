export type AppRole = "admin" | "user";
export type StoreRole = "manager" | "staff" | "viewer" | null;

export function isAdmin(appRole?: AppRole | null) {
  return appRole === "admin";
}

export function canManageStores(appRole?: AppRole | null) {
  return isAdmin(appRole);
}

export function canEditPlanner(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  return storeRole === "manager"; // managers edit planner; staff/viewer read-only
}

export function canRecordSales(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  return storeRole === "manager" || storeRole === "staff"; // staff can record sales
}

export function canViewStore(appRole?: AppRole | null, storeRole?: StoreRole) {
  if (isAdmin(appRole)) return true;
  return storeRole !== null; // any membership can view
}

