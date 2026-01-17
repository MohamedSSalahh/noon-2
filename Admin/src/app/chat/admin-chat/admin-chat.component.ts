import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.css']
})
export class AdminChatComponent implements OnInit, OnDestroy {
  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private http = inject(HttpClient);

  adminId: string = ''; 

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
        this.adminId = user._id;
        this.chatService.joinChat(this.adminId);
        this.loadConversations();
    } else {
        // Fallback or redirect if not logged in
        console.warn('No user logged in for chat');
    }

    this.chatService.getMessages().subscribe((data: any) => {
      // Check if message belongs to current conversation
      if (this.selectedConversation && (data.conversationId === this.selectedConversation._id)) {
        // Check if message is already in list (optimistic update might have added it)
        const exists = this.messages.some(m => m._id === data._id || (m.tempId && m.tempId === data.tempId));
        if (!exists) {
            this.messages.push(data);
        }
      } else {
        // Show notification or update conversation list
      }
    });
  }

  loadConversations() {
    // Should use environment url ideally
    this.http.get<any>('http://localhost:8000/api/v1/chat/conversations').subscribe(res => {
      this.conversations = res.data;
    });
  }

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    this.http.get<any>(`http://localhost:8000/api/v1/chat/${conv._id}`).subscribe(res => {
      this.messages = res.data;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    // Receiver is the other participant
    // Safe check: what if participants array only has 1 person?
    const receiver = this.selectedConversation.participants.find((p: any) => (p._id || p) !== this.adminId);
    
    // Fallback if no specific receiver found (e.g. self chat for testing)
    const receiverId = receiver ? (receiver._id || receiver) : this.adminId;

    const tempId = Date.now().toString(); 
    const msgData = {
      senderId: this.adminId,
      receiverId: receiverId, 
      text: this.newMessage,
      conversationId: this.selectedConversation._id,
      tempId: tempId
    };

    // Optimistic push
    this.messages.push({
        ...msgData,
        sender: { _id: this.adminId }, // Mock populated structure
        createdAt: new Date().toISOString()
    });

    this.chatService.createMessage(msgData).subscribe({
      next: (res: any) => {
        // Update the temp message with real ID if needed, or just let the socket receive handler handle duplicates?
        // Actually, since we optimistically pushed, we might want to update the ID.
        // For simplicity, we assume the socket event will come back.
        // If we want to avoid duplication in UI, we should check IDs.
        // We already have a check in ngOnInit: `if (!exists)`.
      },
      error: (err) => {
        console.error('Failed to send message', err);
        // Optionally remove the optimistic message
      }
    });

    // this.chatService.sendMessage(msgData); // Removed socket emit
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
