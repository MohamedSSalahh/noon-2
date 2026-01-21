import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.css']
})
export class AdminChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  loading: boolean = false;
  loadingMessages: boolean = false;
  isTyping: boolean = false;
  typingTimeout: any;
  
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  adminId: string = '';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScrollToBottom = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.adminId = user._id;
      this.chatService.joinChat(this.adminId);
      this.loadConversations();
    } else {
      console.warn('No user logged in for chat');
    }

    // Listen for incoming messages via Socket.io
    this.chatService.getMessages().subscribe((data: any) => {
      console.log('Received message via Socket.io:', data);
      
      // Check if message belongs to current conversation
      if (this.selectedConversation && (data.conversationId === this.selectedConversation._id)) {
        // Check if message already exists (to avoid duplicates from optimistic updates)
        const exists = this.messages.some(m => m._id === data._id);
        if (!exists) {
          this.messages.push(data);
          this.shouldScrollToBottom = true;
        }
      } else {
        // Message for a different conversation - reload conversation list to show unread
        this.loadConversations();
      }
    });

    // Listen for typing indicators
    this.chatService.onTyping().subscribe((senderId: string) => {
      if (this.selectedConversation) {
        // Just show typing indicator if sender is not me
        if (senderId !== this.adminId) {
          this.isTyping = true;
          this.shouldScrollToBottom = true;
        }
      }
    });

    this.chatService.onStopTyping().subscribe((senderId: string) => {
       if (this.selectedConversation) {
        if (senderId !== this.adminId) {
          this.isTyping = false;
        }
      }
    });
    // Listen for deleted messages
    this.chatService.onMessageDeleted().subscribe((id: string) => {
        this.messages = this.messages.filter(m => m._id !== id);
    });

    // Listen for updated messages
    this.chatService.onMessageUpdated().subscribe((data: any) => {
        const index = this.messages.findIndex(m => m._id === data.id);
        if (index !== -1) {
            this.messages[index].text = data.text;
        }
    });

    // Listen for conversation lock
    this.chatService.onConversationLocked().subscribe((data: any) => {
        if (this.selectedConversation && this.selectedConversation._id === data.conversationId) {
            this.selectedConversation.lockedByManager = true;
            this.selectedConversation.managerName = data.managerName;
        }
    });
  }

  get isLockedForMe(): boolean {
      if (!this.selectedConversation) return false;
      // If I am admin and it is locked, it is locked for me.
      // If I am manager, it is never locked for me.
      // Need to know my role. Assuming AuthService provides it or we can deduce.
      // For now, let's look at user object
      const user = this.authService.currentUser();
      if (user?.role === 'manager') return false;
      return this.selectedConversation.lockedByManager;
  }

  get isManager(): boolean {
      const user = this.authService.currentUser();
      return user?.role === 'manager';
  }

  deleteMessage(msgId: string) {
      if (!confirm('Are you sure you want to delete this message?')) return;
      this.chatService.deleteMessage(msgId).subscribe({
          next: () => {
              this.messages = this.messages.filter(m => m._id !== msgId);
          },
          error: (err) => console.error('Failed to delete message', err)
      });
  }

  editMessage(msg: any) {
      const newText = prompt('Edit message:', msg.text);
      if (newText !== null && newText.trim() !== '' && newText !== msg.text) {
          this.chatService.editMessage(msg._id, newText).subscribe({
              next: (res: any) => {
                  msg.text = newText;
              },
              error: (err) => console.error('Failed to edit message', err)
          });
      }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Scroll error:', err);
    }
  }

  loadConversations() {
    this.loading = true;
    this.chatService.getConversations().subscribe({
      next: (res) => {
        this.conversations = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load conversations', err);
        this.loading = false;
      }
    });
  }

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    this.messages = [];
    this.loadingMessages = true;
    
    // Join conversation room for real-time updates
    this.chatService.joinConversation(conv._id);
    
    this.chatService.getConversationMessages(conv._id).subscribe({
      next: (res) => {
        this.messages = res.data || [];
        this.loadingMessages = false;
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.loadingMessages = false;
      }
    });
  }

  getOtherParticipant(conversation: any): any {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find((p: any) => {
      const participantId = p._id || p;
      return participantId !== this.adminId;
    });
  }

  getParticipantName(conversation: any): string {
    const participant = this.getOtherParticipant(conversation);
    if (!participant) return 'Unknown User';
    return participant.name || participant.email || 'User';
  }

  onTyping() {
    if (!this.selectedConversation) return;
    
    // Emit typing event
    this.chatService.emitTyping(this.adminId, this.selectedConversation._id);
    
    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    // Stop typing after 2 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      this.chatService.emitStopTyping(this.adminId, this.selectedConversation._id);
    }, 2000);
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const receiver = this.getOtherParticipant(this.selectedConversation);
    if (!receiver) {
      console.error('No receiver found');
      return;
    }
    
    const receiverId = receiver._id || receiver;
    const messageText = this.newMessage.trim();

    // Clear input and stop typing indicator
    this.newMessage = '';
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.chatService.emitStopTyping(this.adminId, this.selectedConversation._id);

    // Optimistic update - add message to UI immediately
    const optimisticMessage = {
      _id: 'temp-' + Date.now(),
      sender: { _id: this.adminId, name: 'You' },
      receiver: { _id: receiverId },
      text: messageText,
      createdAt: new Date().toISOString(),
      isRead: false,
      conversationId: this.selectedConversation._id
    };
    this.messages.push(optimisticMessage);
    this.shouldScrollToBottom = true;

    // Send message to server
    const msgData = {
      receiverId: receiverId,
      text: messageText,
      conversationId: this.selectedConversation._id
    };

    this.chatService.createMessage(msgData).subscribe({
      next: (res: any) => {
        console.log('Message sent successfully', res);
        // Update the optimistic message with the real one from server
        const index = this.messages.findIndex(m => m._id === optimisticMessage._id);
        if (index !== -1) {
            // Replace the temp message with the real one (or just update ID)
            // But we must preserve the object ref or replace carefully for Angular detection
            this.messages[index] = { ...res.data, message: res.data.text }; 
        }
      },
      error: (err) => {
        console.error('Failed to send message', err);
        // Remove the optimistic message on error
        this.messages = this.messages.filter(m => m._id !== optimisticMessage._id);
        alert('Failed to send message. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }
}
