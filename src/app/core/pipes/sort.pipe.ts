import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'sort',
    pure: true
})
@Injectable({ providedIn: 'root' })
export class SortPipe implements PipeTransform {
 transform(list: any[], order: 'asc' | 'desc' = 'asc', key?: string): any[] {
  if (!Array.isArray(list)) {
    return list;
  }
  let copiedList = [...list];
  let sorted = copiedList.sort((a, b) => {
    let valA;
    let valB;
    if (key) {
      valA = a[key];
      valB = b[key];
    } else {
      valA = a;
      valB = b;
    }
    return String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base' });
  });
  if (order === 'desc') {
    sorted.reverse();
  }
  return sorted;
}
}
