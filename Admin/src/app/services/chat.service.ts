import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = environment.apiUrl;
  private socketUrl = environment.socketUrl;
  private http = inject(HttpClient);

  constructor() {
    this.socket = io(this.socketUrl);
  }

  joinChat(userId: string) {
    this.socket.emit('join_chat', userId);
  }

  joinConversation(conversationId: string) {
    this.socket.emit('join_conversation', conversationId);
  }

  // Get all conversations (admin only)
  getConversations() {
    return this.http.get<any>(`${this.apiUrl}/api/v1/chat/conversations`);
  }

  // Get messages for a conversation
  getConversationMessages(conversationId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/v1/chat/${conversationId}`);
  }

  // Send a message via HTTP (persists to DB)
  createMessage(data: { receiverId: string, text: string, conversationId: string }) {
    return this.http.post(`${this.apiUrl}/api/v1/chat/message`, data);
  }

  // Listen for incoming messages via Socket.io
  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Typing indicators
  emitTyping(sender: string, receiver: string) {
    this.socket.emit('typing', { sender, receiver });
  }

  emitStopTyping(sender: string, receiver: string) {
    this.socket.emit('stopTyping', { sender, receiver });
  }

  // Listen for typing indicators
  onTyping(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('typing', (senderId: string) => {
        observer.next(senderId);
      });
    });
  }

  onStopTyping(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('stopTyping', (senderId: string) => {
        observer.next(senderId);
      });
    });
  }

  // Delete message
  deleteMessage(id: string) {
    return this.http.delete(`${this.apiUrl}/api/v1/chat/message/${id}`);
  }

  // Edit message
  editMessage(id: string, text: string) {
    return this.http.patch(`${this.apiUrl}/api/v1/chat/message/${id}`, { text });
  }

  // Socket events for message changes
  onMessageDeleted(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message_deleted', (id: string) => {
        observer.next(id);
      });
    });
  }

  onMessageUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message_updated', (data: any) => {
        observer.next(data);
      });
    });
  }
  
  onConversationLocked(): Observable<any> {
      return new Observable(observer => {
          this.socket.on('conversation_locked', (data: any) => {
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
