import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCustomer'
})
export class FilterCustomerPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!items) return [];
    if (!search) return items;

    search = search.toLowerCase();

    return items.filter(x =>
      (x.ma_khang || '').toLowerCase().includes(search) ||
      (x.ten_khang || '').toLowerCase().includes(search)
    );
  }
}
