export type NotificationKind =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "ai";

export type NotificationCategory =
  | "recruitment"
  | "automation"
  | "emails"
  | "system";

export interface NotificationAction {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationKind;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  href?: string;
  actions?: NotificationAction[];
  candidateName?: string;
}
