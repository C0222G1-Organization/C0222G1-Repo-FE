import {ComputerType} from "./computer-type";

export interface Computer {
  id?: number;
  code?: string;
  status?: number;
  location?: string;
  startUsedDate?: string;
  configuration?: string;
  manufacturer?: string;
  deleteStatus?: number;
  warranty?: number;
  computerType?: {
    id?: number;
    name?: string;
  };
}
