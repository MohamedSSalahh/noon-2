import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log('Login success', res);
           if (res.token) {
             this.authService.saveToken(res.token);
             this.authService.saveUser(res.data);
             // Check role to redirect
             if(res.data.role === 'admin') {
                this.router.navigate(['/admin']);
             } else {
                this.router.navigate(['/']);
             }
           }
        },
        error: (err) => {
          console.error('Login error', err);
          alert(err.error.message || 'Login failed');
        }
      });
    }
  }
}
