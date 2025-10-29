// users = {
//   "user123": set{WebSocketConnection},
//   "user456": set{WebSocketConnection},
//   "user789": set{WebSocketConnection}
// }
// admins = {
//     ws,ws,ws
// }

import type WebSocket from "ws";

export class stateManger {
  private users: Map<number, Set<WebSocket>>;
  private admins: Set<WebSocket>;
  private static instance: stateManger;

  constructor() {
    this.users = new Map();
    this.admins = new Set();
  }
  static getInstance(): stateManger {
    if (!stateManger.instance) {
      stateManger.instance = new stateManger();
      console.log("New instance");
    }
    console.log("Made a instance");
    return stateManger.instance;
  }

  addUser(userId: number, ws: WebSocket): void {
    const userExists = this.users.get(userId);
    if (!userExists) {
      this.users.set(userId, new Set([ws]));
      console.log("New user added");
      return;
    } else {
      if (!userExists.has(ws)) {
        userExists.add(ws);
        console.log("User added");
        return;
      }
    }
  }

  removeUser(userId: number, ws: WebSocket): void {
    const userExists = this.users.get(userId);
    if (userExists) {
      const wsDeleted = userExists.delete(ws);
      if (wsDeleted) {
        console.log("user deleted");
        if (userExists.size === 0) {
          this.users.delete(userId);
          console.log(`Removed user ${userId} — no active sockets left`);
        }
      } else console.log("connection doesnot exists");
      return;
    } else {
      console.log("user doesnot exsists");
    }
  }

  addAdmin(ws: WebSocket): void {
    const adminExists = this.admins.has(ws);
    if (!adminExists) {
      this.admins.add(ws);
      console.log("new admin added");
      return;
    } else {
      console.log("admin already exists");
      return;
    }
  }
  removeAdmin(ws: WebSocket): void {
    if (this.admins.has(ws)) {
      this.admins.delete(ws);
      console.log("Admin deleted");
      return;
    } else {
      console.log("admin doesnot exists");
      return;
    }
  }

  broadcastToAdmins(message: object): void {
    this.admins.forEach((ws) => {
      ws.send(JSON.stringify(message));
    });
  }
  
  broadcastToUser(userId: number, message: object): void {
  const sockets = this.users.get(userId);
  if (!sockets) return;
  const data = JSON.stringify(message);
  sockets.forEach(ws => ws.send(data));
}

}

export const instance = stateManger.getInstance();
