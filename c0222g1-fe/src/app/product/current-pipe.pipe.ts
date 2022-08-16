import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
  name: 'currentPipe'
})
export class CurrentPipePipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: any, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): unknown {
    if (value != null) {
      return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
    }
    return this.currencyPipe.transform(0, currencyCode, display, locale).split('0.000')[0];
  }
}
