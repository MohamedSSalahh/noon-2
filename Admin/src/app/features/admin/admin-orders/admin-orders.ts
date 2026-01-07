import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './admin-orders.html',
})
export class AdminOrders implements OnInit {
    orderService = inject(OrderService);
    orders = this.orderService.orders;

    ngOnInit() {
        this.orderService.getAllOrders();
    }

    markAsDelivered(id: string) {
        if(confirm('Mark this order as Delivered?')) {
            this.orderService.updateOrderToDelivered(id).subscribe({
                next: () => this.orderService.getAllOrders(),
                error: (err) => console.error('Error updating order', err)
            });
        }
    }

    markAsPaid(id: string) {
        if(confirm('Mark this order as Paid?')) {
             this.orderService.updateOrderToPaid(id).subscribe({
                next: () => this.orderService.getAllOrders(),
                error: (err) => console.error('Error updating order', err)
            });
        }
    }
}
