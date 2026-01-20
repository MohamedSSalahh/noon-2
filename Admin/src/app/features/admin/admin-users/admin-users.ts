import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
})
export class AdminUsers implements OnInit {
  userService = inject(UserService);
  users = this.userService.users;
  
  // Edit State
  editingUser = signal<any>(null);
  editForm = {
    name: '',
    email: '',
    role: 'user',
    active: true
  };

  ngOnInit() {
    this.userService.getAllUsers();
  }

  deleteUser(id: string) {
    if(confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.userService.getAllUsers(),
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  openEditModal(user: any) {
    this.editingUser.set(user);
    this.editForm = {
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
  }

  closeEditModal() {
    this.editingUser.set(null);
    this.editForm = { name: '', email: '', role: 'user', active: true };
  }

  saveUser() {
    if (!this.editingUser()) return;
    
    this.userService.updateUser(this.editingUser()._id, this.editForm).subscribe({
      next: (res) => {
        this.userService.getAllUsers();
        this.closeEditModal();
      },
      error: (err) => console.error('Error updating user', err)
    });
  }
}
