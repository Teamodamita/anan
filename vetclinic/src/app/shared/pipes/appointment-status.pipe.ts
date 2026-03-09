import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatusPipe',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
