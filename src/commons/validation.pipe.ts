import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    const { error, value: newValue } = this.schema.validate(value, {
      stripUnknown: true,
    });

    if (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        details: error.details,
      });
    }
    return newValue;
  }
}
