import { $ } from 'jquery';

import {
  parshios,
  aliyos,
  aliyanames,
  tikun,
  seforim,
} from '../parshaData';

export const removeNikud = (txt) => {
  // switch classes 'nikud' no nikud to hide other
  // need 2 css rules: .nonikud{display:none} .invis{color:transparent}
  let result = txt
    .replace(new RegExp('nonikud', 'g'), 'non')
    .replace(new RegExp('nikud', 'g'), 'nonikud');
  result = result
    .replace(/([׃׀־])/g, "<span class='invis'>$1</span>")
    .replace(/[^ </'=>׀a-zא-ת׃־]/g, '');
  return result;
};

export const getParshios = (sefer) => parshios[sefer];

export const getRange = (parasha, aliya) => aliyos[parasha][aliya];

export const getSeferFromParasha = (parasha) => {
  // loop through parshios until you find the parasha
  let result;

  Object.keys(parshios).forEach((sefer) => {
    parshios[sefer].forEach((parsha) => {
      if (parsha === parasha) result = parsha;
    });
  });

  return result;
};

export const getText = (parasha, aliya, yesnikud) => {
  const sefer = getSeferFromParasha(parasha);
  const range = getRange(parasha, aliya);
  // input = 6:1 16:17 or 17:8 18:5
  let startPerek = parseInt(range.split(' ')[0].split(':')[0], 10);
  let startPasuk = parseInt(range.split(' ')[0].split(':')[1], 10);
  const endPerek = parseInt(range.split(' ')[1].split(':')[0], 10);
  const endPasuk = parseInt(range.split(' ')[1].split(':')[1], 10);
  let PerekObj = tikun[sefer][startPerek];
  let txt = '';
  if (startPerek === endPerek) {
    while (startPasuk <= endPasuk) {
      txt += `${PerekObj[startPasuk]} `;
      startPasuk += 1;
    }
  } else {
    //  2 scenarios, never have more than 3 perokim in an aliya
    // 1:2 2:3
    // 1:2 3:5 <- include all of 2...
    // go through startperek from startpasuk until no more items
    while (PerekObj[startPasuk]) {
      txt += `${PerekObj[startPasuk]} `;
      startPasuk += 1;
    }
    if (startPerek + 1 < endPerek) {
      // go through whole middle perek
      startPerek += 1;
      startPasuk = 1;
      PerekObj = tikun[sefer][startPerek];
      while (PerekObj[startPasuk]) {
        txt += `${PerekObj[startPasuk]} `;
        startPasuk += 1;
      }
    }
    // then go through endperek from 1 until endpasuk
    PerekObj = tikun[sefer][endPerek];
    startPasuk = 1;
    while (startPasuk <= endPasuk) {
      txt += `${PerekObj[startPasuk]} `;
      startPasuk += 1;
    }
  }
  if (!yesnikud) txt = removeNikud(txt);
  $('#texttest').show();
  return txt;
};
