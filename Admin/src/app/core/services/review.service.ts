import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/reviews';

  reviews = signal<any[]>([]);
  loading = signal<boolean>(false);

  getAllReviews() {
    this.loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
          const data = Array.isArray(res) ? res : (res.data || res.results || []);
          this.reviews.set(data);
      },
      error: (err) => console.error('Error fetching reviews', err),
      complete: () => this.loading.set(false),
    });
  }

  deleteReview(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
