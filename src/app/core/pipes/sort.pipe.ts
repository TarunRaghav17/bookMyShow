import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'sort',
    pure: true
})
@Injectable({ providedIn: 'root' })
export class SortPipe implements PipeTransform {
    transform(list: any[], order: 'asc' | 'desc' = 'asc', key?: string): any[] {
        if (!Array.isArray(list)) return list;
        const dir = order === 'asc' ? 1 : -1;
        return [...list].sort((a, b) => {
            const valA = key ? a[key] : a;
            const valB = key ? b[key] : b;
            if (valA == null) return 1;
            if (valB == null) return -1;
            const numA = +valA, numB = +valB;
            if (!isNaN(numA) && !isNaN(numB)) return (numA - numB) * dir;
            return String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base' }) * dir;
        });
    }
}
