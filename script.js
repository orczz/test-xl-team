'use strict';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
	'August', 'September', 'October', 'November', 'December'
]


var data = {};
var containerSize = 0;
var tileSize = 0;

function getPeriod(start_date, end_date, resultsDate) {

	var startDate = new Date(start_date);
	var endDate = new Date(end_date);
	var resultsDate = new Date(resultsDate);

	startDate.setHours(0,0,0,0);
	endDate.setHours(0,0,0,0);
	resultsDate.setHours(0,0,0,0);

	var startInterval = new Date(startDate);
	startInterval.setMonth(startDate.getMonth() - 1);

	var endInterval = new Date(resultsDate);
	endInterval.setMonth(resultsDate.getMonth() + 1);

	return {
		daysBetween: daysBetween(startInterval, endInterval),
		startDate: startDate,
		endDate: endDate,
		resultsDate: resultsDate,
		startInterval: startInterval,
		endInterval: endInterval
	};
}

function daysBetween(date1, date2) {
	return Math.floor(Math.abs(date2 - date1) / (1E+3 * 60 * 60 * 24));
}

function compareDates(a, b) {
	return daysBetween(a, b);
}

function inInterval(a, is, ie) {
	return (a >= is) && (a <= ie);
}

function getOffset(element) {
	var bodyRect = document.getElementById('container').getBoundingClientRect(),
		elemRect = element.getBoundingClientRect(),
		offset   = {
			top: elemRect.top - bodyRect.top - 40,
			left: elemRect.left - bodyRect.left + (element.clientWidth)
		};

	return offset;
}

function setHtmlData(data) {

	var container = document.getElementById('grafic');
	var tileNum = data.daysBetween;

	var end = new Date(data.endInterval);
	var currentDate = new Date();
	currentDate.setHours(0,0,0,0);
	for(var i = (new Date(data.startInterval)); i < end;) {

		var currentMonth = i.getMonth();

		var tile = document.createElement('span');
		tile.className = 'tile';
		tile.style.width = 100 / tileNum + '%';
		tile.title = months[i.getMonth()];

		if(compareDates(i, currentDate) == 0) {
			tile.className += ' current-date';
		}

		if(inInterval(i, data.startDate, data.endDate) === true) {
			tile.className += ' interval';
		}

		i.setDate(i.getDate() + 1);

		var isDelimiter = false;
		if(i.getMonth() != currentMonth) {
			tile.className += ' month-delimiter';
			isDelimiter = true;
		}
		container.appendChild(tile);
	}
}

function insertSeparators() {

	var delimiters = document.getElementsByClassName('month-delimiter');
	var container = document.getElementById('grafic');

	var lastTile = container.children[container.children.length - 1];
	if(lastTile.className.indexOf('month-delimiter') < 0) {
		var offset = getOffset(lastTile);

		var monthName = document.createElement('div');
		monthName.innerHTML = lastTile.title;
		monthName.className = 'absolute-div';
		monthName.style.top = (offset.top + 100) + 'px';
		monthName.style.left = (offset.left - 90) + 'px';

		container.appendChild(monthName);
	}

	for(var i = 0; i < delimiters.length; i++) {
		var offset = getOffset(delimiters[i]);

		var delimiter = document.createElement('div');
		delimiter.className = 'separator';
		delimiter.style.top = offset.top + 'px';
		delimiter.style.left = offset.left + 'px';

		container.appendChild(delimiter);

		var monthName = document.createElement('div');
		monthName.innerHTML = delimiters[i].title;
		monthName.className = 'absolute-div';
		monthName.style.top = (offset.top + 100) + 'px';
		monthName.style.left = (offset.left - 90) + 'px';

		container.appendChild(monthName);
	}
}

data = getPeriod('2014-10-15', '2014-12-17', '2015-02-20');
setHtmlData(data);
//ensure dom insertion
setTimeout(function () {insertSeparators()}, 100);