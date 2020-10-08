import { CFPEntity } from './cfp.entity';

export class CFPFieldDTO {
  cfp?: CFPEntity;
  type: string;
  name: string;
  title: string;
  hint: string;
  description: string;
  order: number;
}
