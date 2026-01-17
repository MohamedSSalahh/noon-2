import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:8000'; // Server URL
  private http = inject(HttpClient);

  constructor() {
    this.socket = io(this.apiUrl);
  }

  joinChat(userId: string) {
    this.socket.emit('join_chat', userId);
  }

  // Deprecated socket emit, use createMessage instead for persistence
  sendMessage(data: { senderId: string, receiverId: string, text: string, conversationId?: string }) {
    this.socket.emit('send_message', data);
  }

  createMessage(data: { senderId?: string, receiverId: string, text: string, conversationId: string }) {
    return this.http.post(`${this.apiUrl}/api/v1/chat/message`, data);
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
