import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LucideAngularModule, Plus, FileText, Trash2, Pencil, X } from 'lucide-angular';
import { CommonModule } from '@angular/common'; // Added CommonModule for standalone imports if needed implicitly
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
})
export class AdminOrders implements OnInit {
    orderService = inject(OrderService);
    router = inject(Router);
    orders = this.orderService.orders;

    // Icons
    readonly PlusIcon = Plus;
    readonly FileTextIcon = FileText;
    readonly TrashIcon = Trash2;
    readonly PencilIcon = Pencil;
    readonly XIcon = X;
    
    ngOnInit() {
        this.orderService.getAllOrders();
    }

    goToCreateOrder() {
        this.router.navigate(['/admin/orders/create']);
    }

    exportDailyReport() {
        const doc = new jsPDF();
        
        // Filter orders for today
        const today = new Date().toDateString();
        const dailyOrders = this.orders().filter(o => 
            new Date(o.createdAt).toDateString() === today
        );
        
        const dateStr = new Date().toLocaleDateString();

        // Title
        doc.setFontSize(18);
        doc.text(`Daily Sales Report`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Date: ${dateStr}`, 14, 26);


        // Group by Place/Location (assuming 'shippingAddress.details' holds the Place Name based on CreateOrder logic)
        // Adjust property access based on actual order object structure
        const ordersByPlace: {[key: string]: any[]} = {};
        
        dailyOrders.forEach(order => {
            const place = order.shippingAddress?.details || 'Unknown Location';
            if (!ordersByPlace[place]) ordersByPlace[place] = [];
            ordersByPlace[place].push(order);
        });

        let startY = 35;
        let grandTotal = 0;

        // Generate table for each place
        Object.keys(ordersByPlace).forEach(place => {
            const placeOrders = ordersByPlace[place];
            const placeTotal = placeOrders.reduce((sum, o) => sum + (o.totalOrderPrice || 0), 0);
            grandTotal += placeTotal;

            // Section Header
            doc.setFontSize(14);
            doc.text(`Place: ${place}`, 14, startY);
            startY += 6;

            const columns = ['Order ID', 'Customer', 'Items', 'Total'];
            const rows = placeOrders.map(o => [
                '#' + (o._id || o.id).slice(-6),
                o.user?.name || o.customer || 'Guest',
                (o.cartItems || []).length + ' items',
                `$${(o.totalOrderPrice || 0).toFixed(2)}`
            ]);

            // Add Footer for Place Total
             // Fix lint error: ensure typings for row input
            const tableBody: any[] = [
                ...rows,
                [{ content: 'Total for ' + place, colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } }, { content: `$${placeTotal.toFixed(2)}`, styles: { fontStyle: 'bold' } }]
            ];

            autoTable(doc, {
                head: [columns],
                body: tableBody,
                startY: startY,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] },
                margin: { bottom: 10 }
            });

            // Update startY for next table
            startY = (doc as any).lastAutoTable.finalY + 15;
        });

        // Overall Daily Total
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Daily Sales: $${grandTotal.toFixed(2)}`, 14, startY);

        if (dailyOrders.length === 0) {
            doc.text('No orders found for today.', 14, 40);
        }

        doc.save(`daily-sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    generateInvoice(order: any) {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.text('INVOICE', 14, 20);
        
        doc.setFontSize(10);
        doc.text(`Order ID: #${(order._id || order.id).slice(-6)}`, 14, 30);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 35);
        
        const customerName = order.guestName || order.user?.name || 'Guest';
        const place = order.shippingAddress?.details || 'Unknown Location';
        
        doc.text(`Customer: ${customerName}`, 14, 45);
        doc.text(`Place: ${place}`, 14, 50);

        // Columns
        const columns = ['Barcode', 'Product Name', 'Unit Price', 'Qty', 'Total'];
        
        const rows = (order.cartItems || []).map((item: any) => {
            const product = item.product || {};
            const itemTotal = item.price * item.quantity;
            return [
                product.barcode || '---',
                product.title || 'Product',
                `$${item.price.toFixed(2)}`,
                item.quantity,
                `$${itemTotal.toFixed(2)}`
            ];
        });

        // Add Table using correct typing or casting
        const tableBody: any[] = [
            ...rows,
            [
                { content: 'GRAND TOTAL', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } }, 
                { content: `$${(order.totalOrderPrice || 0).toFixed(2)}`, styles: { fontStyle: 'bold' } }
            ]
        ];

        autoTable(doc, {
            head: [columns],
            body: tableBody,
            startY: 60,
            theme: 'striped',
            headStyles: { fillColor: [66, 66, 66] },
        });

        doc.save(`invoice-${(order._id || order.id).slice(-6)}.pdf`);
    }

    deleteOrder(id: string) {
        if(confirm('Are you sure you want to delete this order? This will restore the stock quantity for all items in the order.')) {
             this.orderService.deleteOrder(id).subscribe({
                next: () => {
                    this.orderService.getAllOrders();
                },
                error: (err) => alert('Failed to delete order')
            });
        }
    }

    navigateToEdit(id: string) {
        this.router.navigate(['/admin/orders/edit', id]);
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
