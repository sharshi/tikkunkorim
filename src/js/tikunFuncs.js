import { $ } from 'jquery';
import {
  aliyos,
  aliyanames,
  seforim,
} from './parshaData';
import {
  removeNikud,
  getParshios,
  getSeferFromParasha,
} from './util/util';
import { israelParshaCal, chulParshaCal } from './parshaCal';

const targetID = 'menu';
const options = {
  currParsha,
  currAliya,
  showNikud: true,
  parshaCalendar,
  geoLocation,
};

const fillAliyos = (parsha) => {
  $('html, body').animate({
    scrollTop: 0,
  }, 'fast');
  const itemTemplate = '<li>{{text}}</li>';
  let list = '';
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
    localStorage.currView = 'text';
  });
  localStorage.latestParsha = currParsha; // Gets latest parsha
  localStorage.currView = 'aliyos';
  $('.spacer').show();
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
  for (let i = 0; i < prshs.length; i += 1) {
    list += itemTemplate.replace('{{text}}', prshs[i]);
  }
  $(`#${targetID}`).html(list);
  // now make each li clickable
  $(`#${targetID} li`).on('click', () => {
    fillAliyos($(this).html());
    $('#parshnm').html($(targetID).html());
  });
  $('.rb').show();
  $('#bottombar').hide();
  localStorage.currView = 'parshios';
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

  // !localStorage.myLocation || list += insertThisParsha();
  // !localStorage.latestParsha || list += insertLatestParsha();

  // create list of parshiyot
  $('#menu').html(list);
  // now make each li clickable
  $('#menu li.listSeforim').on('click', () => {
    fillParshios($(this).html());
  });
  $(`#${targetID} li.listParsha`).on('click', () => {
    fillAliyos($(this).html());
    localStorage.currView = 'aliyos';
    $('.rb').show();
    $('#banner').hide();
    $('#bottombar').hide();
  });
  localStorage.currView = 'seforim';
  $('.rb,.bn').hide();
  $('#banner').show();
  $('#bottombar').show();
  $('#parshnm, #alinm').html('');
  $('.spacer').show();
}

function goback() {
  $('.spacer').show();
  if (localStorage.currView === 'text') {
    $('#texttest').hide();
    $(`#sidebar, #${targetID}`).show();
    fillAliyos(currParsha);
  } else if (localStorage.currView === 'aliyos') {
    fillParshios(getSeferFromParasha(currParsha));
  } else if (localStorage.currView === 'parshios') {
    fillSeforim();
  } else if (localStorage.currView === 'settings') {
    $('#settingsView').hide();
    fillSeforim();
  } else if (localStorage.currView === 'about') {
    $('#aboutView').hide();
    localStorage.currView = 'seforim';
  } else if (localStorage.currView === 'os') {
    $('#osView').hide();
    localStorage.currView = 'about';
  } else if (localStorage.currView === 'abt') {
    $('#abtView').hide();
    localStorage.currView = 'about';
  } else if (localStorage.currView === 'seforim') navigator.app.exitApp();
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

function setText(px, size) {
  localStorage.ls = px;
  localStorage.btnBg = size;
  $('#texttest,#setDesc.showTextSize').css('font-size', px);
  $('.reg').css('background', size === 'reg' ? 'white' : '#efdca9');
  $('.large').css('background', size === 'large' ? 'white' : '#efdca9');
  $('.xLarge').css('background', size === 'xLarge' ? 'white' : '#efdca9');
}

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
  // show menu and back button
  $('#menu>li').click(() => $('.rb').show());

  // enter settings from main screen
  $('#settings').click(() => {
    $('#settingsView').show();
    localStorage.currView = 'settings';
  });

  // leave settings to main screen
  $('#setDone').click(() => {
    $('#settingsView').hide();
    localStorage.currView = 'seforim';
  });

  // enter about from main screen
  $('#about').click(() => {
    $('#aboutView').show();
    localStorage.currView = 'about';
  });

  // leave about to main screen
  $('#aboutDone').click(() => {
    $('#aboutView').hide();
    localStorage.currView = 'seforim';
  });

  // select open sourse from about screen go to open source view
  $('#about5').click(() => {
    $('#osView').show();
    localStorage.currView = 'os';
  });

  // leave open source view go to about screen
  $('#osViewBack').click(() => {
    $('#osView').hide();
    localStorage.currView = 'about';
  });

  // select info from about screen go to info view
  $('#about4').click(() => {
    $('#abtView').show();
    localStorage.currView = 'abt';
  });

  // leave info view go to about screen
  $('#abtViewBack').click(() => {
    $('#abtView').hide();
    localStorage.currView = 'about';
  });
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
  const { ls, btnBg, locBtnBg } = localStorage;

  /* set text size */
  if (ls) {
    $('#texttest,#setDesc.showTextSize').css('font-size', ls);
  }

  $('.reg').on('click', () => setText('22px', 'reg'));
  $('.large').on('click', () => setText('26px', 'large'));
  $('.xLarge').on('click', () => setText('30px', 'xLarge'));

  /* color of text size buttons */
  if (btnBg) {
    $(`.${btnBg}`).css('background', 'white');
  }
  /* color of location buttons */
  if (locBtnBg) {
    $(`.${locBtnBg}`).css('background', 'white');
  }

  // left/right keypress for desktop
  $('body').keydown((e) => {
    if (e.keyCode === 37) { // left
      nextprevAli(1);
    } else if (e.keyCode === 39) { // right
      nextprevAli(-1);
    } else if (e.keyCode === 13) { // switch text
      toggleNikud();
    }
  });

  navRules();
});

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
    localStorage.thisWP = thisWeekParsha;
  });
}

// setting where you are
function getLocation() {
// need to test if this runs
  if (localStorage.myLocation === 'inCh') {
    geoLocation = 'in ch';
    // TODO:change parshacal var to chul
    parshaCalendar = chulParshaCal;
  } else if (localStorage.myLocation === 'inIl') {
    geoLocation = 'in ey';
    // TODO:change parshacal var to ey
    parshaCalendar = israelParshaCal;
  }

  $('.inChul').click(() => {
    localStorage.myLocation = 'inCh';
    localStorage.locBtnBg = 'inChul';
    $('div.geoLoc').html('In Chul');

    $('div#textSize.inChul').css('background', 'white');
    $('div#textSize.inEy').css('background', '#efdca9');
  });
  $('.inEy').click(() => {
    localStorage.myLocation = 'inIl';
    localStorage.locBtnBg = 'inEy';
    $('div.geoLoc').html('In EY');

    $('div#textSize.inEy').css('background', 'white');
    $('div#textSize.inChul').css('background', '#efdca9');
  });

  $('div.geoLoc').html(geoLocation);
}

function insertThisParsha() {
  return `<br><p>פרשת השבוע:</p><li class="listParsha">${localStorage.thisWP}</li>`;
}

function insertLatestParsha() {
  return `<p>המקום האחרון:</p><li class="listParsha">${localStorage.latestParsha}</li>`;
}

document.addEventListener('backbutton', goback, false);
