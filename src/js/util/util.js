export const removeNikud = (txt) => {
  // switch classes 'nikud' no nikud to hide other
  // need 2 css rules: .nonikud{display:none} .invis{color:transparent}
  txt = txt.replace(new RegExp('nonikud', 'g'), 'non').replace(new RegExp('nikud', 'g'), 'nonikud');
  txt = txt.replace(/([׃׀־])/g, '<span class=\'invis\'>$1</span>').replace(/[^ <\/'=>׀a-zא-ת׃־]/g, '');
  return txt;
}