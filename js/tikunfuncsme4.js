var targetID = 'menu',
	currParsha,
	currAliya,
	showNikud = true,
	currView,
	btnColor,
	parshaCalendar,
	geoLocation,
	list = "";
function getParshios(sefer) {
	return parshios[sefer];
}

function getRange(parasha, aliya) {
	return aliyos[parasha][aliya];
}

function nextprevAli(dir) {
	if (dir == -1 && currAliya == 1) return;
	if (dir == 1 && currAliya == 7 && currParsha == 'וזאת הברכה') return;
	currAliya += dir;
	$('#texttest').html(getText(currParsha, currAliya, showNikud)).show();
	window.scrollTo(0, 0);
	$('#alinm').html(aliyanames[currAliya - 1]);
}

function goback() {
	$('.spacer').show();
	if (currView == 'text') {
		$('#texttest').hide();
		$('#sidebar, #' + targetID).show();
		fillAliyos(currParsha);
	} else if (currView == 'aliyos'){
	fillParshios(getSeferFromParasha(currParsha));
	} else if (currView == 'parshios'){
	fillSeforim();
	} else if (currView == 'settings') {
	$('#settingsView').hide();
	fillSeforim();
	} else if (currView == 'about') {
	$('#aboutView').hide();
	currView = 'seforim';
	} else if (currView == 'os') {
	$('#osView').hide();
	currView = 'about';
	}else if (currView == 'abt') {
	$('#abtView').hide();
	currView = 'about';
	} else if (currView == 'seforim') navigator.app.exitApp();
}

function fillSeforim() {
	$('html, body').animate({
		scrollTop: 0
	}, 'fast');
	var itemTemplate = '<li class="listSeforim">{{text}}</li>'
	list = ""
	$('#menu').html('');
	for (var s in seforim)
	list += itemTemplate.replace('{{text}}', seforim[s]);

	//insertThisParsha();
	//insertLatestParsha();

	//create list of parshiyot
	$('#menu').html(list);
	//now make each li clickable
	$('#menu li.listSeforim').click(function() {
		fillParshios($(this).html());
	});
	$('#' + targetID + ' li.listParsha').click(function() {
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

function fillParshios(sefer) {
	$('#banner').hide();
	$('html, body').animate({
		scrollTop: 0
	}, 'fast');
	var itemTemplate = '<li>{{text}}</li>'
	var list = '';
	$('#' + targetID).html('');
	var prshs = getParshios(sefer);
	for (var p in prshs)
	list += itemTemplate.replace('{{text}}', prshs[p]);
	$('#' + targetID).html(list);
	//now make each li clickable
	$('#' + targetID + ' li').click(function() {
		fillAliyos($(this).html());
		$('#parshnm').html($(targetID).html());
	})
	$('.rb').show();
	$('#bottombar').hide();
	currView = 'parshios';
	$('#parshnm, #alinm').html('');
	$('.spacer').show();
}

function fillAliyos(parsha) {
	$('html, body').animate({
		scrollTop: 0
	}, 'fast');
	var itemTemplate = '<li>{{text}}</li>'
	var list = '';
	$('#' + targetID).html('');
	var numAliyas = 7;
	if (aliyos[parsha][8]) numAliyas = 8;
	for (var i = 0; i < numAliyas; i++)
	list += itemTemplate.replace('{{text}}', aliyanames[i]);
	$('#' + targetID).html(list);
	$('#parshnm').html(parsha);
	$('#alinm').html('');
	currParsha = parsha;
	//now make each li clickable
	$('#' + targetID + ' li').click(function() {
		$('#' + targetID).hide();
		$('#sidebar').hide();
		currAliya = $(this).index() + 1;
		$('#texttest').html(getText(currParsha, currAliya, showNikud)).show();
		window.scrollTo(0, 0);
		// show back and forth (next/prev) buttons
		$('.bn').show();
		$('#alinm').html(aliyanames[currAliya - 1]);
		currView = 'text';//??
	})
	setCookie('latestParsha',currParsha);// Gets latest parsha
	currView = 'aliyos';
	$('.spacer').show();

}

function getSeferFromParasha(parasha) {
	//loop through parshios until you find the parasha
	for (var ky in parshios)
	for (var p in parshios[ky])
	if (parshios[ky][p] == parasha) return ky;
}

function getText(parasha, aliya, yesnikud) {
	var sefer = getSeferFromParasha(parasha);
	var range = getRange(parasha, aliya);
	//input = 6:1 16:17 or 17:8 18:5
	var startPerek = parseInt(range.split(' ')[0].split(':')[0], 10);
	var startPasuk = parseInt(range.split(' ')[0].split(':')[1], 10);
	var endPerek = parseInt(range.split(' ')[1].split(':')[0], 10);
	var endPasuk = parseInt(range.split(' ')[1].split(':')[1], 10);
	var PerekObj = tikun[sefer][startPerek];
	var txt = '';
	if (startPerek == endPerek) {
		while (startPasuk <= endPasuk) {
			txt += PerekObj[startPasuk] + ' ';
			startPasuk++;
		}
	} else {
		//  2 scenarios, never have more than 3 perokim in an aliya
		// 1:2 2:3
		// 1:2 3:5 <- include all of 2...
		//go through startperek from startpasuk until no more items
		while (PerekObj[startPasuk]) {
			txt += PerekObj[startPasuk] + ' ';
			startPasuk++;
		}
		if (startPerek + 1 < endPerek) {
			//go through whole middle perek
			startPerek++;
			startPasuk = 1;
			PerekObj = tikun[sefer][startPerek];
			while (PerekObj[startPasuk]) {
				txt += PerekObj[startPasuk] + ' ';
				startPasuk++;
			}
		}
		//then go through endperek from 1 until endpasuk
		PerekObj = tikun[sefer][endPerek];
		startPasuk = 1;
		while (startPasuk <= endPasuk) {
			txt += PerekObj[startPasuk] + ' ';
			startPasuk++;
		}
	}
	if (!yesnikud) txt = removeNikud(txt);
	$('#texttest').show();
	return txt;
}

function removeNikud(txt) {
	//switch classes 'nikud' no nikud to hide other
	// need 2 css rules: .nonikud{display:none} .invis{color:transparent}
	txt = txt.replace(new RegExp('nonikud', 'g'), 'non').replace(new RegExp('nikud', 'g'), 'nonikud');
	txt = txt.replace(/([׃׀־])/g, '<span class=\'invis\'>$1</span>').replace(/[^ <\/'=>׀a-zא-ת׃־]/g, '');
	return txt;
}

function toggleNikud() {
	var txt = $('#texttest').html();
	//if has nukid, just remove
	if (/[ֱֲֳִֵֶ]/.test(txt)) txt = removeNikud(txt);
	else //reload
	txt = getText(currParsha, currAliya, true);
	$('#texttest').html(txt);
	showNikud = !showNikud;
}

$(document).ready(function() {
	//getThisWeeksParsha();
	fillSeforim();
	$('#menubar>div').hide();
	$('#banner').show();
	$('#texttest').click(function() {
		toggleNikud()
	});
	$('#prevali').click(function() {
		nextprevAli(-1)
	});
	$('#nextali').click(function() {
		nextprevAli(1)
	});
  //TEXT SIZE
	var ls,	btnBg, locBtnBg;
	ls=getCookie('ls');
	btnBg=getCookie('btnBg');
	locBtnBg=getCookie('locBtnBg');


	/*set text size*/
		if (ls == null) {
   		}
    	else {
    	$('#texttest,#setDesc.showTextSize').css('font-size', ls);
    	}

    	$('.reg').click(function() {setTextNormal();});
		$('.large').click(function() {setTextBig();});
		$('.xLarge').click(function() {setTextBigger();});


		$('.xLarge').click(function() {setTextBigger();});
		$('.xLarge').click(function() {setTextBigger();});

	/*color of text size buttons*/
		if (btnBg == null) {
   		}
    	else {
    	$('.'+ btnBg).css('background', 'white');
    	}
	/*color of location buttons*/
		if (locBtnBg == null) {
   		}
    	else {
    	$('.'+ locBtnBg).css('background', 'white');
    	}
 //SWIPING temporarily disabled
	/*$('#texttest').bind('swipeleft', swipeleftHandler);
	// Callback function references the event target and adds the 'swipeleft' class to it

	function swipeleftHandler(event) {
		nextprevAli(-1);
	}
	$('#texttest').bind('swiperight', swiperightHandler);
	// Callback function references the event target and adds the 'swipeleft' class to it

	function swiperightHandler(event) {
		nextprevAli(1);
	}*/
	//left/right keypress for desktop
	$("body").keydown(function(e) {
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

function navRules(){
	$('#but').click(function() {
		$('#menubar>div').hide();
		$('#' + targetID).show();
		$('#sidebar').show();
		fillSeforim();
		$('#texttest').html('');
		$('#texttest').hide();
	});
	$('#backb').click(function() {
		goback();
		$('#texttest').hide();
		$('.bn').hide();
	})
	// show menu and bach button
	$('#menu>li').click(function() {
		$('.rb').show();
	});

	//enter settings from main screen
	$('#settings').click(function() {
		$('#settingsView').show();
	currView = 'settings';
	});

	//leave settings to main screen
	$('#setDone').click(function() {
		$('#settingsView').hide();
	currView = 'seforim';
	});

	//enter about from main screen
	$('#about').click(function() {
		$('#aboutView').show();
	currView = 'about';
	});

	//leave about to main screen
	$('#aboutDone').click(function() {
		$('#aboutView').hide();
	currView = 'seforim';
	});

	//select open sourse from about screen go to open source view
	$('#about5').click(function() {
		$('#osView').show();
	currView = 'os';
	});

	//leave open source view go to about screen
	$('#osViewBack').click(function() {
		$('#osView').hide();
	currView = 'about';
	});

	//select info from about screen go to info view
	$('#about4').click(function() {
		$('#abtView').show();
	currView = 'abt';
	});

	//leave info view go to about screen
	$('#abtViewBack').click(function() {
		$('#abtView').hide();
	currView = 'about';
	});
}

	/*
	Text size
	.>>>>>>*/

	function setTextNormal(){
		setCookie('ls','22px');
		setCookie('btnBg','reg');
		$('#texttest,#setDesc.showTextSize').css('font-size', '22px');
		$('.reg').css('background', 'white');
		$('.large').css('background', '#efdca9');
		$('.xLarge').css('background', '#efdca9');
	}
	function setTextBig(){
		setCookie('ls','26px');
		setCookie('btnBg','large');
		$('#texttest,#setDesc.showTextSize').css('font-size', '26px');
		$('.reg').css('background', '#efdca9');
		$('.large').css('background', 'white');
		$('.xLarge').css('background', '#efdca9');
	}
	function setTextBigger(){
		setCookie('ls','30px');
		setCookie('btnBg','xLarge');
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
	/*^^^^^
	Text size
	*/

//Get this week's Parsha
function getThisWeeksParsha(){
	getLocation();
	var today = new Date();
    var thisWeekParsha = null;
  $.each(parshaCalendar, function(key, value) {
    var s = new Date(key);
    var t = new Date(s - 604800000);
    if (t < today && s >= today) {
      thisWeekParsha = value;
    }
		setCookie('thisWP',thisWeekParsha);
  });
}

//setting where you are
function getLocation(){
//need to test if this runs
	if (getCookie('myLocation') === "inCh") {
    	geoLocation = "in ch"
    	//TODO:change parshacal var to chul
    	parshaCalendar = chulParshaCal;
		} else if (getCookie('myLocation') === "inIl") {
    	geoLocation = "in ey"
    	//TODO:change parshacal var to ey
    	parshaCalendar = israelParshaCal;
	}

	$('.inChul').click(function () {
    	setCookie('myLocation', "inCh");
		setCookie('locBtnBg','inChul');
		$('div.geoLoc').html('In Chul');

		$('div#textSize.inChul').css('background', 'white');
		$('div#textSize.inEy').css('background', '#efdca9');
	});
	$('.inEy').click(function () {
	    setCookie('myLocation', "inIl");
		setCookie('locBtnBg','inEy');
		$('div.geoLoc').html("In EY");

		$('div#textSize.inEy').css('background', 'white');
		$('div#textSize.inChul').css('background', '#efdca9');
	});

	$('div.geoLoc').html(geoLocation);
}


function insertThisParsha(){

	if(getCookie('myLocation') === undefined || getCookie('myLocation') === null){
    	//do nothing
 	}else{
	list += '<br><p>פרשת השבוע:</p><li class="listParsha">'+ getCookie('thisWP')+'</li>';
	}
}


function insertLatestParsha(){
	if(getCookie('latestParsha') === undefined || getCookie('latestParsha') === null){
    	//do nothing
 	}else{
	list += '<p>המקום האחרון:</p><li class="listParsha">'+ getCookie('latestParsha')+'</li>';
	}
}

/*var mywindow = $(window);
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
});*/
