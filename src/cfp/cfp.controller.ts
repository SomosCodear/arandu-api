import { Controller, Get, Param } from '@nestjs/common';
import { CFP } from './cfp.service';

@Controller('cfps')
export class CFPController {
  constructor(private cfp: CFP) {}
  @Get(':slug')
  getCFPById(@Param('slug') slug: string) {
    return this.cfp.getBySlug(slug);
  }
}
