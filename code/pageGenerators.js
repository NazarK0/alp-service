var fest = require('fest');
var fs = require("fs");
var helper = require("./pageGeneratorsHelper.js");

function getIndexPage() {
	var templateFile = "templates/index.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Промышленные альпинисты в Санкт-Петербурге";
	json["h1"]["tagname"] = "#promyshlennye-alpinisty-v-spb";
	json["page"]["title"] = "Промышленные альпинисты в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Промышленные альпинисты компании Альп Сервис в Санкт-Петербурге.";
	json["page"]["content"] = "промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["main"] = "focused";

	var brandMass = [
		{ id: "brand-transneft", clientText: "Наш клиент:", clientName: "Транснефть", url: "/experience/transneft" },
		{ id: "brand-russtandart", clientText: "Наш клиент:", clientName: "Русский Стандарт", url: "/experience/russkij-standart" },
		{ id: "brand-mega", clientText: "Наш клиент:", clientName: "ТРЦ Мега", url: "/experience/trc-mega" },
		{ id: "brand-rzhd", clientText: "Наш клиент:", clientName: "ОАО РЖД", url: "/experience/oao-rzhd" },
		{ id: "brand-toyota", clientText: "Наш клиент:", clientName: "Toyota", url: "/experience/toyota" },
		{ id: "brand-hyundai", clientText: "Наш клиент:", clientName: "Hyundai", url: "/experience/hyundai" }
	];


	/*
	brandMass[] = [0,1,2,3,4]
	page["body"]["brands"] = [
		{0,1,2},
		{1,2,3},
		{2,3,4},
		{3,4,0}
		{4,0,1},
	]
	*/
	var rand = getRandomInt(0, brandMass.length - 1);
	//console.log(rand);
	json["body"] = {
		brands: {
			currentPos: rand,
			mass: [],
			currentPage: [],
			url: []
		}
	};

	json["body"]["brands"]["mass"] = [];
	len = brandMass.length;
	for (var i = 0; i < len; i++ ) {
		var i0 = i;
		var i1 = i + 1;
		if (i1 >= len) {
			i1 = 0;
		}
		var i2 = i1 + 1;
		if (i2 >= len) {
			i2 = 0;
		}
		json["body"]["brands"]["mass"][i] = [
			{
				id: brandMass[i0].id,
				clientText: brandMass[i0].clientText,
				clientName: brandMass[i0].clientName,
				url: brandMass[i0].url
			},
			{
				id: brandMass[i1].id,
				clientText: brandMass[i1].clientText,
				clientName: brandMass[i1].clientName,
				url: brandMass[i1].url
			},
			{
				id: brandMass[i2].id,
				clientText: brandMass[i2].clientText,
				clientName: brandMass[i2].clientName,
				url: brandMass[i2].url
			}
		];
	}
	var curr = json["body"]["brands"]["currentPos"];
	//console.log("currPos: " + curr);
	//console.log(json["body"]["brands"]["mass"][curr][0].id);
	json["body"]["brands"]["currentPage"] = [
		{
			id: json["body"]["brands"]["mass"][curr][0].id,
			clientText: json["body"]["brands"]["mass"][curr][0].clientText,
			clientName: json["body"]["brands"]["mass"][curr][0].clientName,
			url: json["body"]["brands"]["mass"][curr][0].url,
		},
		{
			id: json["body"]["brands"]["mass"][curr][1].id,
			clientText: json["body"]["brands"]["mass"][curr][1].clientText,
			clientName: json["body"]["brands"]["mass"][curr][1].clientName,
			url: json["body"]["brands"]["mass"][curr][1].url,
		},
		{
			id: json["body"]["brands"]["mass"][curr][2].id,
			clientText: json["body"]["brands"]["mass"][curr][2].clientText,
			clientName: json["body"]["brands"]["mass"][curr][2].clientName,
			url: json["body"]["brands"]["mass"][curr][2].url,
		}
	];

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getServicePage() {
	var templateFile = "templates/service.xml";	

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Услуги компании «Альп Сервис»";
	json["h1"]["tagname"] = "#uslugi-kompanii-alp-service";
	json["page"]["title"] = "Услуги промышленных альпинистов в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Услуги промышленных альпинистов в Санкт-Петербурге.";
	json["page"]["content"] = "услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getVidyRabotPage() {
	var templateFile = "templates/service/vidy-vysotnykh-rabot-i-ceny-na-vysotnye-raboty.xml";	

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Виды высотных работ и цены";
	json["h1"]["tagname"] = "#vidy-vysotnyh-rabot-i-ceny-na-vysotnye-raboty";
	json["page"]["title"] = "Услуги промышленных альпинистов в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Виды высотных работ и цены на высотные работы в Санкт-Петербурге в компании «Альп Сервис».";
	json["page"]["content"] = "виды высотных работ, цены на высотные работы, герметизация, отделочные работы, высотный клининг, монтаж наружной рекламы, монтаж стробоскопов, монтаж элементов фасада, монтаж металлоконструкций, ремонт кровли, устройство жесткой кровли, поднятие грузов, дополнительные виды работ, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["main"] = "focused";

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getExperiencePage() {
	var templateFile = "templates/experience.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Опыт работ";
	json["h1"]["tagname"] = "#opyt-rabot";
	json["page"]["title"] = "Опыт работ | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Опыт работ.";
	json["page"]["content"] = "опыт работ, опыт работ компании альп сервис, портфолио, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["expr"] = "focused";

	var experienceData = fs.readFileSync("input/experience.json", "utf8");
	json["exptables"] = JSON.parse(experienceData);
	//json["exp-tables"] = JSON.parse("{\"exp-tables\":\"value\"}");  // aaaa"//new ["objects"][ json["exp-tables"]["objects"].length ]["value"] = "ТРК Невский";
	//json["exp-tables"]["objects"][ json["exp-tables"]["objects"].length ]["url"] = "";

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getDocsPage() {
	var templateFile = "templates/docs.xml";	

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Полезная документация";
	json["h1"]["tagname"] = "#poleznaya-documentaciya";
	json["page"]["title"] = "Полезная документация";
	json["page"]["description"] = "Полезная документация.";
	json["page"]["content"] = "полезная документация, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["docs"] = "focused";

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getContactsPage() {
	var templateFile = "templates/contacts.xml";	

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Контактная информация";
	json["h1"]["tagname"] = "#contact-info";
	json["page"]["title"] = "Контактная информация";
	json["page"]["description"] = "Контактная информация.";
	json["page"]["content"] = "контактная информация, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["cont"] = "focused";

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getKrovelnyeRabotyPage() {
	var templateFile = "templates/service/krovelnye-raboty.xml";	

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Кровельные работы";
	json["h1"]["tagname"] = "#krovelnye-raboty";
	json["page"]["title"] = "Кровельные работы в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение кровельных работ в Санкт-Петербурге.";
	json["page"]["content"] = "кровельные работы, кровля, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/krovelnye-raboty.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json); //fest.render(templateFile, JSON.parse(jsonData));
    return data;
}

function getGermetizaciyaShvovPage() {
	var templateFile = "templates/service/germetizaciya-mezhpanelnykh-stykov-shvov.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Герметизация межпанельных швов";
	json["h1"]["tagname"] = "#germetizaciya-mezhpanelnykh-stykov-shvov";
	json["page"]["title"] = "Герметизация межпанельных стыков и швов в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение работ по герметизации межпанельных стыков и швов в Санкт-Петербурге.";
	json["page"]["content"] = "межпанельные стыки, межпанельные швы, герметизация межпанельных стыков, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/germetizaciya.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json);
    return data;
}

function getFasadnyeRabotyPage() {
	var templateFile = "templates/service/fasadnye-raboty.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Фасадные работы";
	json["h1"]["tagname"] = "#fasadnye-raboty";
	json["page"]["title"] = "Фасадные работы в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение фасадных работ методом промышленного альпинизма в Санкт-Петербурге.";
	json["page"]["content"] = "фасадные работы, выполнение фасадных работ, фасадные работы спб, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/fasadnye-raboty.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json);
	return data;
}

function getObespylivaniePage() {
	var templateFile = "templates/service/obespylivanie.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Обеспыливание конструкций";
	json["h1"]["tagname"] = "#obespylivanie-konstrukcij";
	json["page"]["title"] = "Обеспыливание конструкций в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение работ по обеспыливанию помещений в Санкт-Петербурге.";
	json["page"]["content"] = "обеспыливание, работы по обеспыливанию, обеспыливание помещений, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/obespylivanie.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json);
	return data;
}

function getKliningPage() {
	var templateFile = "templates/service/klining.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Мойка окон и фасадов (высотный клининг)";
	json["h1"]["tagname"] = "#mojka-okon-i-fasadov-vysotnyj-klining";
	json["page"]["title"] = "Мойка окон и фасадов (высотный клининг) в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение работ по мойке окон и фасадов, высотный клининг в Санкт-Петербурге.";
	json["page"]["content"] = "мойка окон, мытьё окон, мойка фасадов, мытьё фасадов, высотный клининг, клининговые работы, клининг в спб, высотный клининг спб, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/klining.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json);
	return data;
}

function getUborkaSnegaPage() {
	var templateFile = "templates/service/uborka-snega.xml";

	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	json["h1"]["title"] = "Уборка снега";
	json["h1"]["tagname"] = "#uborka-snega";
	json["page"]["title"] = "Уборка снега, очистка крыш от снега в Санкт-Петербурге | Промышленные альпинисты компании «Альп Сервис»";
	json["page"]["description"] = "Выполнение работ по очистке крыш от снега, уборка снега в Санкт-Петербурге.";
	json["page"]["content"] = "уборка снега, уборка снега в спб, уборка снега спб, очистка снега, очистка снега с крыш, очистка снега спб, услуги, промышленные альпинисты, промышленные альпинисты спб, промальп";
	helper.resetFocused(json);
	json["navigation"]["focused"]["serv"] = "focused";

	var serviceData = fs.readFileSync("input/service/uborka-snega.json", "utf8");
	json["servicedata"] = JSON.parse(serviceData);

	var data = fest.render(templateFile, json);
	return data;
}

function getSitemapPage() {
	var templateFile = "templates/sitemap.xml";

	var urlsData = fs.readFileSync("input/urls.json", "utf8");
	var json = JSON.parse(urlsData);
	json["url"] = "http://alp-service.ru";


	var experienceUrlsData = fs.readFileSync("input/experience/1.01-urls.json", "utf8");
	var json2 = JSON.parse(experienceUrlsData);

	expJson = json2["experience-urls"];
	for (var i in expJson) {
		console.log("" + i);
		json["router"][json["router"].length] = {
			url: "/experience/" + i,
			lastmod: "2015-12-21",
			changefreq: "daily",
			priority: "0.8"
		};
	}

	var data = fest.render(templateFile, json);
    return data;
}

function get404Page() {
	var templateFile = "templates/page404.xml";
	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
	var data = fest.render(templateFile, json);
    return data;
}

function getPartnersPage() {
	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
    json["h1"]["title"] = "Наши партнёры";
    json["page"]["title"] = "Партнёры компании «Альп Сервис»";
	var data = fest.render("templates/partners.xml", json);
    return data;
}

function getPartnersPeterburgNedvPage() {
	var jsonData = fs.readFileSync("input/index.json", "utf8");
    var json = JSON.parse(jsonData);
    json["h1"]["title"] = "Компания «Петербургская недвижимость»";
    json["page"]["title"] = "«Петербургская недвижимость» — партнёр компании «Альп Сервис»";
    var data = fest.render("templates/partners/peterburgskaya-nedvizhimost.xml", json);
	return data;
}


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getIndexPage = getIndexPage;
exports.getServicePage = getServicePage;
exports.getVidyRabotPage = getVidyRabotPage;
exports.getExperiencePage = getExperiencePage;
exports.getDocsPage = getDocsPage;
exports.getContactsPage = getContactsPage;
exports.getKrovelnyeRabotyPage = getKrovelnyeRabotyPage;
exports.getGermetizaciyaShvovPage = getGermetizaciyaShvovPage;
exports.getFasadnyeRabotyPage = getFasadnyeRabotyPage;
exports.getObespylivaniePage = getObespylivaniePage;
exports.getKliningPage = getKliningPage;
exports.getUborkaSnegaPage = getUborkaSnegaPage;
exports.getSitemapPage = getSitemapPage;
exports.get404Page = get404Page;
exports.getPartnersPage = getPartnersPage;
exports.getPartnersPeterburgNedvPage = getPartnersPeterburgNedvPage;