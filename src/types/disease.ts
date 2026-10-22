export interface IDisease {
  id: number;
  name: string;
  count: number;
  month: string;
  year: number;
}

export interface IDiseaseTrend {
  month: string;
  disease: string;
  count: number;
}
