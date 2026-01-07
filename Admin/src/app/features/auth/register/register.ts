import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
        alert('Passwords do not match');
        return;
      }
      
      this.authService.signup(this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log('Signup success', res);
          // Assuming response has token, save it (optional, usually login is required after signup or auto-login)
           if (res.token) {
             this.authService.saveToken(res.token);
             this.authService.saveUser(res.data);
             this.router.navigate(['/']);
           } else {
             this.router.navigate(['/auth/login']);
           }
        },
        error: (err) => {
          console.error('Signup error', err);
          alert(err.error.message || 'Signup failed');
        }
      });
    }
  }
}
