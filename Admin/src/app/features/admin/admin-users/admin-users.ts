import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
})
export class AdminUsers implements OnInit {
  userService = inject(UserService);
  users = this.userService.users;

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
}
