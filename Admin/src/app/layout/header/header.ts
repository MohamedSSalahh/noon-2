import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  // We can access authService.currentUser() in template directly
  
  constructor() {
      // Debug effect
      effect(() => {
          console.log('Header: Current User:', this.authService.currentUser());
      });
  }
}
