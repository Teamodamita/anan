import { Pipe, PipeTransform } from '@angular/core';

// calcula edad legible desde birth_date
@Pipe({ name: 'petAge', standalone: false })
export class PetAgePipe implements PipeTransform {
  transform(birthDate: string): string {
    if (!birthDate) return 'Desconocida';

    const birth = new Date(birthDate);
    const now = new Date();

    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 1) return 'Menos de 1 mes';
    if (totalMonths < 12) return `${totalMonths} mes${totalMonths > 1 ? 'es' : ''}`;

    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return m > 0 ? `${y} año${y > 1 ? 's' : ''} y ${m} mes${m > 1 ? 'es' : ''}` : `${y} año${y > 1 ? 's' : ''}`;
  }
}