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
  sections: {
    publishers: SectionPerms;
    apps: SectionPerms;
    billing: SectionPerms;
    postbacks: SectionPerms;
    // Extendable: add more sections if backend adds them
  };
}

