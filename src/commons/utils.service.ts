import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  sortObjectsList(property: string, order = 'asc'): (a: any, b: any) => number {
    const orderN = order === 'asc' ? 1 : -1;
    return (a, b) => {
      const propA = a[property];
      const propB = b[property];
      let result = 0;
      if (propA > propB) {
        result = 1 * orderN;
      } else if (propB > propA) {
        result = -1 * orderN;
      }

      return result;
    };
  }
}
