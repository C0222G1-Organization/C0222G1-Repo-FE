import {District} from './district';

export interface Commune {
  id?: number;
  name?: string;
  district: District;
}
