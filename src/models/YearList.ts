import objectHash from 'object-hash';
import Year from './Year'
import utils from '../utils/utils';

class YearList {
  public readonly years: Year[];
  public readonly keys: string[];
  public selected: {year: Year, key: string};

  constructor(years: {year: string|number, mapDate: string}[]) {
    years.map(({year, mapDate}, index) => {
      const y = new Year(year, mapDate, index);
      this.years.push(y);
      this.keys.push(objectHash(y));
    }
  }

  get() {
    return this.years;
  }

  addYear(year) {
    this.years.push(year);
  }

  removeYear(year) {
    this.years = this.years.filter(y => y !== year);
  }
}