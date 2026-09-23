import { Response } from 'express';

export interface RealtimeClient {
  id: string;
  userId?: string;
  role?: string;
  res: Response;
}

export type RealtimeEventType =
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'INVENTORY_CHANGED'
  | 'SUBSCRIPTION_UPDATED'
  | 'REWARD_EARNED'
  | 'SUPPORT_MESSAGE_RECEIVED'
  | 'CAMPAIGN_PUBLISHED'
  | 'DELIVERY_STATUS_CHANGED';

export interface RealtimeEvent {
  type: RealtimeEventType;
  payload: any;
  timestamp: string;
}

class RealtimeHub {
  private clients: Map<string, RealtimeClient> = new Map();

  public addClient(client: RealtimeClient): void {
    this.clients.set(client.id, client);
    // Send immediate ping
    this.sendToClient(client, {
      type: 'DELIVERY_STATUS_CHANGED',
      payload: { message: 'Real-time telemetry connected to House of Pops dispatch engine.' },
      timestamp: new Date().toISOString(),
    });
  }

  public removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  public broadcast(event: RealtimeEvent, targetUserId?: string): void {
    const rawData = `data: ${JSON.stringify(event)}\n\n`;

    this.clients.forEach((client) => {
      // If targeting a specific user, deliver to that user or to admins
      if (targetUserId) {
        if (client.userId === targetUserId || client.role === 'admin') {
          try {
            client.res.write(rawData);
          } catch (e) {
            this.clients.delete(client.id);
          }
        }
      } else {
        // Broadcast to all active listeners
        try {
          client.res.write(rawData);
        } catch (e) {
          this.clients.delete(client.id);
        }
      }
    });
  }

  private sendToClient(client: RealtimeClient, event: RealtimeEvent): void {
    try {
      client.res.write(`data: ${JSON.stringify(event)}\n\n`);
    } catch (e) {
      this.clients.delete(client.id);
    }
  }

  public getActiveCount(): number {
    return this.clients.size;
  }
}

export const realtime = new RealtimeHub();
