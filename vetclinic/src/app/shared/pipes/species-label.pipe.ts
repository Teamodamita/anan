import { Pipe, PipeTransform } from '@angular/core';
import { PetSpecies } from '../../core/models/pet';

// traduce species enum a etiqueta en español
@Pipe({ name: 'speciesLabel', standalone: false })
export class SpeciesLabelPipe implements PipeTransform {
  private readonly speciesMap: Record<PetSpecies, string> = {
    dog: 'Perro',
    cat: 'Gato',
    bunny: 'Conejo'
  };

  transform(value: PetSpecies): string {
    return this.speciesMap[value] ?? value;
  }
}