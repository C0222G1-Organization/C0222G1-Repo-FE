export interface Commune {
  id?: number;
  communeName?: string;
  district: {
    id?: number;
    districtName?: string;
    province: {
      id?: number;
      provinceName: string;
    }
  };
}
