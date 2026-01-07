import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';


@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [],
  templateUrl: './admin-reviews.html',
})
export class AdminReviews implements OnInit {
  reviewService = inject(ReviewService);
  reviews = this.reviewService.reviews;

  ngOnInit() {
    this.reviewService.getAllReviews();
  }

  deleteReview(id: string) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.reviewService.getAllReviews();
        },
        error: (err) => alert('Failed to delete review')
      });
    }
  }
}
