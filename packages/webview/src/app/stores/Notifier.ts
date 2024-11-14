import { Notification, NotificationKind } from "cloudformation-3d-shared";

class Notifier {
  subscribers: Map<
    NotificationKind,
    Set<(notification: Notification) => void>
  > = new Map();

  subscribe(
    type: NotificationKind,
    callback: (notification: Notification) => void
  ) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);
  }

  unsubscribe(
    type: NotificationKind,
    callback: (notification: Notification) => void
  ) {
    this.subscribers.get(type)?.delete(callback);
  }

  notifySubscribers(notification: Notification) {
    this.subscribers
      .get(notification.kind)
      ?.forEach((callback) => callback(notification));
  }
}

export const notifier = new Notifier();
