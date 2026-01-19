import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductServiceTs } from '../../../core/services/product.service';
import { LucideAngularModule, Search, Edit2, Trash2, Plus, Minus, Filter, FileText } from 'lucide-angular';
import { ProductInventoryFormComponent } from '../product-inventory-form/product-inventory-form.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, ProductInventoryFormComponent],
  templateUrl: './inventory-table.component.html'
})
export class InventoryTableComponent implements OnInit {
  private productService = inject(ProductServiceTs);

  searchControl = new FormControl('');
  filterControl = new FormControl('all');
  
  // Track modal state
  showModal = false;
  selectedProduct: any = null; // Type as Product | null ideally

  filteredProducts = computed(() => {
    const all = this.productService.products();
    const search = (this.searchControl.value || '').toLowerCase();
    const filter = this.filterControl.value;

    return all.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search) || (p.barcode?.toLowerCase().includes(search) || false);
      
      let matchesFilter = true;
      if (filter === 'low') {
        matchesFilter = p.quantity < (p.reorderPoint || 10);
      } else if (filter === 'out') {
        matchesFilter = p.quantity === 0;
      }

      return matchesSearch && matchesFilter;
    });
  });

  // Icons
  readonly SearchIcon = Search;
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly FilterIcon = Filter;
  readonly FileTextIcon = FileText;

  ngOnInit() {
    this.productService.getAllProducts();
  }

  exportPdf() {
    const doc = new jsPDF();
    const products = this.filteredProducts();
    const date = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(18);
    doc.text('Inventory Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 28);

    // Calculate Grand Total
    const grandTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

    // Columns
    const columns = ['Barcode', 'Product Name', 'Category', 'Stock', 'Unit Price', 'Total Value'];
    
    // Rows
    const rows = products.map(p => [
      p.barcode || '---',
      p.title,
      p.category?.name || 'N/A',
      p.quantity,
      `$${p.price.toFixed(2)}`,
      `$${(p.price * p.quantity).toFixed(2)}`
    ]);

    // Footer Row (Grand Total)
    const tableData: any[] = [
      ...rows,
      [
        { content: 'GRAND TOTAL', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
        { content: totalItems, styles: { fontStyle: 'bold' } }, 
        '', 
        { content: `$${grandTotal.toFixed(2)}`, styles: { fontStyle: 'bold' } }
      ]
    ];

    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 35,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
      footStyles: { fillColor: [243, 244, 246], textColor: 0, fontStyle: 'bold' }
    });

    doc.save(`inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  openAddModal() {
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.productService.getAllProducts(); // Refresh
        },
        error: (err) => console.error(err)
      });
    }
  }

  adjustStock(product: any, amount: number) {
    const newQuantity = Math.max(0, product.quantity + amount);
    if (newQuantity === product.quantity) return;

    this.productService.updateStock(product._id, newQuantity).subscribe({
      next: () => {
        // Optimistic update or refresh
        this.productService.getAllProducts();
      }
    });
  }

  handleProductSaved() {
    this.closeModal();
    this.productService.getAllProducts();
  }
}
