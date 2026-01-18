export interface SectionPerms {
  view: boolean;
  add: boolean;
  change: boolean;
  delete: boolean;
}

export interface DashboardPermissions {
  is_staff: boolean;
  email: string;
  allowed_routes: string[];
  assigned_app_ids?: number[];
  assigned_apps?: { id: number; app_name: string }[];
  sections: {
    publishers: SectionPerms;
    apps: SectionPerms;
    billing: SectionPerms;
    postbacks: SectionPerms;
    // Extendable: add more sections if backend adds them
  };
}
