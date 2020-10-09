import { CFPFieldEntity } from './cfpField.entity';

export class CFPFieldOptionDTO {
  field?: CFPFieldEntity;
  value: string;
  title: string;
  description: string;
  order: number;
}
