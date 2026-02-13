import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  keyword = '';
  customers: Customer[] = [];
  loading = false;
  errorMessage = '';
  selectedCustomerId: string | null = null;

  displayedColumns: string[] = [
    'select',
    'actions',
    'customeid',
    'note',
    'lat',
    'lng',
  ];

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.onSearch();
  }

onSelectCustomer(row: Customer): void {
  this.selectedCustomerId = row.customeid;
  console.log('Đã chọn khách hàng:', this.selectedCustomerId);
}

  onSearch(): void {
    this.loading = true;

    this.customerService.searchCustomer(this.keyword).subscribe({
      next: data => {
        this.customers = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Không tải được dữ liệu!';
        this.loading = false;
      }
    });
  }

  onSelectRow(row: Customer): void {
    this.selectedCustomerId = row.customeid;
  }

  onShowRoute(row: Customer): void {
    this.router.navigate(['/customer-map'], {
      queryParams: {
        id: row.customeid,
        lat: row.lat,
        lng: row.lng
      }
    });
  }

  openGoogleMaps(row: Customer): void {
    const lat = row.lat;
    const lng = row.lng;
  
    // Deep link mở app Google Maps
    const googleMapsApp = `geo:${lat},${lng}?q=${lat},${lng}`;
  
    // Mở app nếu có, fallback sang web
    window.location.href = googleMapsApp;
  
    setTimeout(() => {
      // Nếu app không mở → fallback Google Maps web
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
        '_blank'
      );
    }, 800);
  }
  
  
}
