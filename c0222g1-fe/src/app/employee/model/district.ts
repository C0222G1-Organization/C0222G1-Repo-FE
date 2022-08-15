export interface District {
  id?: number;
  districtName: string;
  province: {
    id: number;
    provinceName: string;
  };
}
