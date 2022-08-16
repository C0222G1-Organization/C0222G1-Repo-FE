import {AppUser} from './appuser';
import {Position} from './position';
import {Commune} from './commune';
import {District} from './district';
import {Province} from './province';

export interface Employee {
  id?: number;
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  salary?: number;
  dob?: string;
  startWork?: string;
  statusDelete?: number;
  image?: string;
  position?: Position;
  appUser?: AppUser;
  disName?: string;
  proName?: string;
  cmName?: string;
  posiName?: string;
  commune?: Commune;
  district?: District;
  province?: Province;
  workf: string;
}
