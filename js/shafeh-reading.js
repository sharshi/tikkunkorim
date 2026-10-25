// Only explicit reader selections are handed off. No account or question data.
function shafehReadingUrl(book, range) {
  var books = {"בראשית": "bereishis", "שמות": "shemos", "ויקרא": "vayikra", "במדבר": "bamidbar", "דברים": "devarim"};
  var match = typeof range === "string" && range.match(/^([1-9]\d{0,2}):([1-9]\d{0,2}) ([1-9]\d{0,2}):([1-9]\d{0,2})$/);
  if (!books[book] || !match) return null;
  return "https://shafeh.org/chumash/reading/" + books[book] + "/" + match.slice(1).join("/");
}

function updateShafehReadingLink() {
  var link = document.getElementById("shafeh-reading");
  if (!link) return;
  var range = currView === "text" && aliyos[currParsha] && aliyos[currParsha][currAliya];
  var url = range && shafehReadingUrl(getSeferFromParasha(currParsha), range);
  link.hidden = !url;
  if (url) link.href = url;
  else link.removeAttribute("href");
}

// Menu/settings clicks may leave the reading view. Refresh after its handler.
document.addEventListener("click", function () {
  setTimeout(updateShafehReadingLink, 0);
});
