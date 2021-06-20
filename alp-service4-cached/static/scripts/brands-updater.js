/*
	brands-updater.js

	Выполняются операции по обновлению интерактивного списка с брендами на главной странице сайта (http://alp-service.ru/).
	ul#brands-data-container - все данные, которыми оперируют функции, находятся внутри страницы, с которой был вызов.
	table#brands-table - частично обновляются данные таблицы.
*/

function brandsUpdateLeft() {
	var currentPos = parseInt(document.getElementById("brands-data-container").getAttribute("currentPos"));
	var mass = document.getElementById("brands-data-container").getElementsByTagName("li");
	currentPos--;
	if (currentPos < 0) {
		currentPos = mass.length - 1;
	}
	brandsDataUpdate(document, mass[currentPos], currentPos);
}

function brandsUpdateRight() { 
	var currentPos = parseInt(document.getElementById("brands-data-container").getAttribute("currentPos"));
	var mass = document.getElementById("brands-data-container").getElementsByTagName("li");
	currentPos++;
	if (currentPos >= mass.length) {
		currentPos = 0;
	}
	console.log(mass[currentPos]);
	brandsDataUpdate(document, mass[currentPos], currentPos);
}

function brandsDataUpdate(document, mass, currentPos) {
	var brands = mass.getElementsByTagName("a");
	for (var i = 0; i < 3; i++) {
		var id = brands[i].getAttribute("vId");
		document.getElementById("brands-table-div" + i).getElementsByTagName("div")[0].setAttribute("id",id);
		document.getElementById("brands-table-client-name-link" + i).innerText = brands[i].getAttribute("clientName");
		document.getElementById("brands-table-client-name-link" + i).setAttribute("href", brands[i].getAttribute("url"));
		document.getElementById("brands-table-client-text" + i).innerText = brands[i].getAttribute("clientText");

		document.getElementById("brands-table-div" + i + "-link").setAttribute("href", brands[i].getAttribute("url"));
	}
	document.getElementById("brands-data-container").setAttribute("currentPos", currentPos);
}
