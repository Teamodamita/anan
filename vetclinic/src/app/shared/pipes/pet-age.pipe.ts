import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'petAgePipe',
})
export class PetAgePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
