import { $ } from 'jquery';
import {
  parshios,
  aliyos,
  aliyanames,
  tikun,
  seforim,
} from './parshaData';

const targetID = 'menu';
let currParsha;
let currAliya;
let showNikud = true;
let currView;
let parshaCalendar;
let geoLocation;
let list = '';

function getParshios(sefer) {
  return parshios[sefer];
}

function getRange(parasha, aliya) {
  return aliyos[parasha][aliya];
}

const getText = (parasha, aliya, yesnikud) => {
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
      startPasuk++;
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

const fillAliyos = (parsha) => {
  $('html, body').animate({
    scrollTop: 0,
  }, 'fast');
  const itemTemplate = '<li>{{text}}</li>';
  list = '';
  $(`#${targetID}`).html('');
  let numAliyas = 7;
  if (aliyos[parsha][8]) numAliyas = 8;
  for (let i = 0; i < numAliyas; i += 1) { list += itemTemplate.replace('{{text}}', aliyanames[i]); }
  $(`#${targetID}`).html(list);
  $('#parshnm').html(parsha);
  $('#alinm').html('');
  currParsha = parsha;
  // now make each li clickable
  $(`#${targetID} li`).on('click', () => {
    $(`#${targetID}`).hide();
    $('#sidebar').hide();
    currAliya = $(this).index() + 1;
    $('#texttest').html(getText(currParsha, currAliya, showNikud)).show();
    window.scrollTo(0, 0);
    // show back and forth (next/prev) buttons
    $('.bn').show();
    $('#alinm').html(aliyanames[currAliya - 1]);
    currView = 'text';
  });
  setCookie('latestParsha', currParsha); // Gets latest parsha
  currView = 'aliyos';
  $('.spacer').show();
};

const getSeferFromParasha = (parasha) => {
  // loop through parshios until you find the parasha
  for (const ky in parshios) {
    for (const p in parshios[ky]) { if (parshios[ky][p] == parasha) return ky; }
  }
  return `${parasha} not found`;
};

function fillParshios(sefer) {
  $('#banner').hide();
  $('html, body').animate({
    scrollTop: 0,
  }, 'fast');
  const itemTemplate = '<li>{{text}}</li>';
  let list = '';
  $(`#${targetID}`).html('');
  const prshs = getParshios(sefer);
  for (const p in prshs) { list += itemTemplate.replace('{{text}}', prshs[p]); }
  $(`#${targetID}`).html(list);
  // now make each li clickable
  $(`#${targetID} li`).on('click', () => {
    fillAliyos($(this).html());
    $('#parshnm').html($(targetID).html());
  });
  $('.rb').show();
  $('#bottombar').hide();
  currView = 'parshios';
  $('#parshnm, #alinm').html('');
  $('.spacer').show();
}

function fillSeforim() {
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    'fast',
  );
  const itemTemplate = '<li class="listSeforim">{{text}}</li>';
  list = '';
  $('#menu').html('');
  for (const s in seforim) {
    list += itemTemplate.replace('{{text}}', seforim[s]);
  }

  // insertThisParsha();
  // insertLatestParsha();

  // create list of parshiyot
  $('#menu').html(list);
  // now make each li clickable
  $('#menu li.listSeforim').on('click', () => {
    fillParshios($(this).html());
  });
  $(`#${targetID} li.listParsha`).on('click', () => {
    fillAliyos($(this).html());
    currView = 'aliyos';
    $('.rb').show();
    $('#banner').hide();
    $('#bottombar').hide();
  });
  currView = 'seforim';
  $('.rb,.bn').hide();
  $('#banner').show();
  $('#bottombar').show();
  $('#parshnm, #alinm').html('');
  $('.spacer').show();
}

function goback() {
  $('.spacer').show();
  if (currView === 'text') {
    $('#texttest').hide();
    $(`#sidebar, #${targetID}`).show();
    fillAliyos(currParsha);
  } else if (currView === 'aliyos') {
    fillParshios(getSeferFromParasha(currParsha));
  } else if (currView === 'parshios') {
    fillSeforim();
  } else if (currView === 'settings') {
    $('#settingsView').hide();
    fillSeforim();
  } else if (currView === 'about') {
    $('#aboutView').hide();
    currView = 'seforim';
  } else if (currView == 'os') {
    $('#osView').hide();
    currView = 'about';
  } else if (currView == 'abt') {
    $('#abtView').hide();
    currView = 'about';
  } else if (currView == 'seforim') navigator.app.exitApp();
}

function nextprevAli(dir) {
  if (dir === -1 && currAliya === 1) return;
  if (dir === 1 && currAliya === 7 && currParsha === 'וזאת הברכה') return;
  currAliya += dir;
  $('#texttest').html(getText(currParsha, currAliya, showNikud)).show();
  window.scrollTo(0, 0);
  $('#alinm').html(aliyanames[currAliya - 1]);
}

function toggleNikud() {
  let txt = $('#texttest').html();
  // if has nukid, just remove
  if (/[ֱֲֳִֵֶ]/.test(txt)) txt = removeNikud(txt);
  else // reload
  { txt = getText(currParsha, currAliya, true); }
  $('#texttest').html(txt);
  showNikud = !showNikud;
}

$(() => {
  // getThisWeeksParsha();
  fillSeforim();
  $('#menubar>div').hide();
  $('#banner').show();
  $('#texttest').on('click', () => {
    toggleNikud();
  });
  $('#prevali').on('click', () => {
    nextprevAli(-1);
  });
  $('#nextali').on('click', () => {
    nextprevAli(1);
  });

  // TEXT SIZE
  let ls; let btnBg; let
    locBtnBg;
  ls = getCookie('ls');
  btnBg = getCookie('btnBg');
  locBtnBg = getCookie('locBtnBg');

  /* set text size */
  if (ls) {
    $('#texttest,#setDesc.showTextSize').css('font-size', ls);
  }

  $('.reg').on('click', () => setTextNormal());
  $('.large').on('click', () => setTextBig());
  $('.xLarge').on('click', () => setTextBigger());

  /* color of text size buttons */
  if (btnBg == null) {
  } else {
    $(`.${btnBg}`).css('background', 'white');
  }
  /* color of location buttons */
  if (locBtnBg == null) {
  } else {
    $(`.${locBtnBg}`).css('background', 'white');
  }

  // left/right keypress for desktop
  $('body').keydown((e) => {
    if (e.keyCode == 37) { // left
      nextprevAli(1);
    } else if (e.keyCode == 39) { // right
      nextprevAli(-1);
    } else if (e.keyCode == 13) { // switch text
      toggleNikud();
    }
  });
  navRules();
});

function navRules() {
  $('#but').click(() => {
    $('#menubar>div').hide();
    $(`#${targetID}`).show();
    $('#sidebar').show();
    fillSeforim();
    $('#texttest').html('');
    $('#texttest').hide();
  });
  $('#backb').click(() => {
    goback();
    $('#texttest').hide();
    $('.bn').hide();
  });
  // show menu and bach button
  $('#menu>li').click(() => {
    $('.rb').show();
  });

  // enter settings from main screen
  $('#settings').click(() => {
    $('#settingsView').show();
    currView = 'settings';
  });

  // leave settings to main screen
  $('#setDone').click(() => {
    $('#settingsView').hide();
    currView = 'seforim';
  });

  // enter about from main screen
  $('#about').click(() => {
    $('#aboutView').show();
    currView = 'about';
  });

  // leave about to main screen
  $('#aboutDone').click(() => {
    $('#aboutView').hide();
    currView = 'seforim';
  });

  // select open sourse from about screen go to open source view
  $('#about5').click(() => {
    $('#osView').show();
    currView = 'os';
  });

  // leave open source view go to about screen
  $('#osViewBack').click(() => {
    $('#osView').hide();
    currView = 'about';
  });

  // select info from about screen go to info view
  $('#about4').click(() => {
    $('#abtView').show();
    currView = 'abt';
  });

  // leave info view go to about screen
  $('#abtViewBack').click(() => {
    $('#abtView').hide();
    currView = 'about';
  });
}

/*
  Text size
  .>>>>>> */

function setTextNormal() {
  setCookie('ls', '22px');
  setCookie('btnBg', 'reg');
  $('#texttest,#setDesc.showTextSize').css('font-size', '22px');
  $('.reg').css('background', 'white');
  $('.large').css('background', '#efdca9');
  $('.xLarge').css('background', '#efdca9');
}
function setTextBig() {
  setCookie('ls', '26px');
  setCookie('btnBg', 'large');
  $('#texttest,#setDesc.showTextSize').css('font-size', '26px');
  $('.reg').css('background', '#efdca9');
  $('.large').css('background', 'white');
  $('.xLarge').css('background', '#efdca9');
}
function setTextBigger() {
  setCookie('ls', '30px');
  setCookie('btnBg', 'xLarge');
  $('#texttest,#setDesc.showTextSize').css('font-size', '30px');
  $('.reg').css('background', '#efdca9');
  $('.large').css('background', '#efdca9');
  $('.xLarge').css('background', 'white');
}

function getCookie(c_name) {
  return localStorage[c_name];
}
function setCookie(cname, cvalue) {
  localStorage[cname] = cvalue;
}
/* ^^^^^
  Text size
  */

// Get this week's Parsha
function getThisWeeksParsha() {
  getLocation();
  const today = new Date();
  let thisWeekParsha = null;
  $.each(parshaCalendar, (key, value) => {
    const s = new Date(key);
    const t = new Date(s - 604800000);
    if (t < today && s >= today) {
      thisWeekParsha = value;
    }
    setCookie('thisWP', thisWeekParsha);
  });
}

// setting where you are
function getLocation() {
// need to test if this runs
  if (getCookie('myLocation') === 'inCh') {
    geoLocation = 'in ch';
    // TODO:change parshacal var to chul
    parshaCalendar = chulParshaCal;
  } else if (getCookie('myLocation') === 'inIl') {
    geoLocation = 'in ey';
    // TODO:change parshacal var to ey
    parshaCalendar = israelParshaCal;
  }

  $('.inChul').click(() => {
    setCookie('myLocation', 'inCh');
    setCookie('locBtnBg', 'inChul');
    $('div.geoLoc').html('In Chul');

    $('div#textSize.inChul').css('background', 'white');
    $('div#textSize.inEy').css('background', '#efdca9');
  });
  $('.inEy').click(() => {
    setCookie('myLocation', 'inIl');
    setCookie('locBtnBg', 'inEy');
    $('div.geoLoc').html('In EY');

    $('div#textSize.inEy').css('background', 'white');
    $('div#textSize.inChul').css('background', '#efdca9');
  });

  $('div.geoLoc').html(geoLocation);
}

function insertThisParsha() {
  if (getCookie('myLocation') === undefined || getCookie('myLocation') === null) {
    // do nothing
  } else {
    list += `<br><p>פרשת השבוע:</p><li class="listParsha">${getCookie('thisWP')}</li>`;
  }
}

function insertLatestParsha() {
  if (getCookie('latestParsha') === undefined || getCookie('latestParsha') === null) {
    // do nothing
  } else {
    list += `<p>המקום האחרון:</p><li class="listParsha">${getCookie('latestParsha')}</li>`;
  }
}

document.addEventListener('backbutton', onBackKeyDown, false);

function onBackKeyDown() {
  goback();
}

/* var mywindow = $(window);
var mypos = mywindow.scrollTop();
var up = false;
var newscroll;
mywindow.scroll(function() {
  newscroll = mywindow.scrollTop();
  if (newscroll > mypos && !up) {
    $('#menubar').stop().slideToggle();
    up = !up;
    console.log(up);
  } else if (newscroll < mypos && up) {
    $('#menubar').stop().slideToggle();
    up = !up;
  }
  mypos = newscroll;
}); */
