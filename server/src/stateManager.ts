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
  private admins:Set<WebSocket>;
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
  addUser(userId: number, ws: WebSocket):void{

  }



}

export const instance = stateManger.getInstance();


// addUser(userId: number, ws: WebSocket)

// removeUser(userId: number, ws: WebSocket)

// addAdmin(ws: WebSocket)

// removeAdmin(ws: WebSocket)

// broadcastToAdmins(message: object)