import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {

   transform(value: number): string {
    if (value == null || isNaN(value)) return '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    const hourText = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minuteText = minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : '';

    if (!hourText && !minuteText) return '0 min';
    if (hourText && minuteText) return `${hourText} ${minuteText}`;
    return hourText || minuteText;
  }
}

