import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm transition-all duration-300">
      <div class="relative">
         <!-- Modern Spinner -->
         <div class="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
         <!-- Logo or Icon in center -->
         <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-2 h-2 bg-black rounded-full"></div>
         </div>
      </div>
    </div>
  `,
  styles: []
})
export class GlobalLoaderComponent {
  loadingService = inject(LoadingService);
}
