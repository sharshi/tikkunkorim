export interface Meta {
  sefer: number;
  perek: number;
  pasuk: number;
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
