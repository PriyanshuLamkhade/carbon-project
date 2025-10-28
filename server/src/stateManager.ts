// users = {
//   "user123": WebSocketConnection,
//   "user456": WebSocketConnection,
//   "user789": WebSocketConnection
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
}

export const instance = stateManger.getInstance();
