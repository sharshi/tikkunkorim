export interface Meta {
  sefer: number | null;
  perek: number | null;
  pasuk: number | null;
}

export interface Line {
  number: number;
  fragments: string[];
  meta: Meta[];
  aliyot: number[];
  layout: 'satum' | 'patuch' | string;
}

export interface Amud {
  amud: number;
  lines: Line[];
}

export interface TikkunData {
  [key: number]: Amud;
}

export interface LehaderesLetter {
  os: string;
  r1: string;
  r2: string;
}
