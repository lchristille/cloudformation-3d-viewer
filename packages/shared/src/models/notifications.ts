export type NotificationKind = "template.addedDocument" | "other";

export interface Notification {
  kind: NotificationKind;
  payload: string;
}