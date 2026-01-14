import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:8000'; // Server URL

  constructor() {
    this.socket = io(this.apiUrl);
  }

  joinChat(userId: string) {
    this.socket.emit('join_chat', userId);
  }

  sendMessage(data: { senderId: string, receiverId: string, text: string, conversationId?: string }) {
    this.socket.emit('send_message', data);
  }

  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
