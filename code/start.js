var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fs = require("fs");

var pageGen = require('./pageGenerators.js');
var helper = require('./session-helper.js');

var app = express();
app.use(cookieParser()); // must use cookieParser before expressSession
app.use(expressSession({ secret: helper.makeID() })); // 'somesecrettokenhere304904jfjfjfjfjshsys'
app.use(bodyParser());
  
function getIndexPage(request, response) {
	var html = pageGen.getIndexPage();
	response.send(html);
}
function getServicePage(request, response) {
	var html = pageGen.getServicePage();
	response.send(html);
}
function getKrovelnyeRabotyPage(request, response) {
	var html = pageGen.getKrovelnyeRabotyPage();
	response.send(html);
}
function getGermetizaciyaShvovPage(request, response) {
	var html = pageGen.getGermetizaciyaShvovPage();
	response.send(html);	
}
function getVidyRabotPage(request, response) {
	var html = pageGen.getVidyRabotPage();
	response.send(html);
}
function getExperiencePage(request, response) {
	var html = pageGen.getExperiencePage();
	response.send(html);
}
function getDocsPage(request, response) {
	var html = pageGen.getDocsPage();
	response.send(html);
}
function getContactsPage(request, response) {
	var html = pageGen.getContactsPage();
	response.send(html);
}

function initGetPages() {
	var sitemapMass = new Array();

	var mass = [];
	var indexMass = new Array('/index.html', '/index.htm', '/index', '/');
	var i = 0;
	for (i = 0; i < indexMass.length; i++) {
		app.get(indexMass[i], function(request, response) { getIndexPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/';
	}

	var serviceMass = new Array('/service.html', '/service.htm', '/service');
	for (i = 0; i < serviceMass.length; i++) {
		app.get(serviceMass[i], function(request, response) { getServicePage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/service';
	}

	var krovelnyeRabotyMass = new Array('/service/krovelnye-raboty.html', '/service/krovelnye-raboty.htm', '/service/krovelnye-raboty', '/krovelnye-raboty.html', '/krovelnye-raboty.htm', '/krovelnye-raboty');
	for (i = 0; i < krovelnyeRabotyMass.length; i++) {
		app.get(krovelnyeRabotyMass[i], function(request, response) { getKrovelnyeRabotyPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/krovelnye-raboty';
	}
	
	var germetizaciyaMass = new Array('/service/germetizaciya-mezhpanelnykh-stykov-shvov.html', '/service/germetizaciya-mezhpanelnykh-stykov-shvov.htm', '/service/germetizaciya-mezhpanelnykh-stykov-shvov', '/germetizaciya-mezhpanelnykh-stykov-shvov.html', '/germetizaciya-mezhpanelnykh-stykov-shvov.htm', '/germetizaciya-mezhpanelnykh-stykov-shvov');
	for (i = 0; i < germetizaciyaMass.length; i++) {
		app.get(germetizaciyaMass[i], function(request, response) { getGermetizaciyaShvovPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/krovelnye-raboty';
	}


	var vidyRabotMass = new Array('/vidy-vysotnykh-rabot-i-ceny-na-vysotnye-raboty', '/vidy-vysotnykh-rabot-i-ceny-na-vysotnye-raboty.html', '/vidy-vysotnykh-rabot-i-ceny-na-vysotnye-raboty.htm');
	for (i = 0; i < vidyRabotMass.length; i++) {
		app.get(vidyRabotMass[i], function(request, response) { getVidyRabotPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/vidy-vysotnykh-rabot-i-ceny-na-vysotnye-raboty';
	}

	var experienceMass = new Array('/experience.html', '/experience.htm', '/experience');
	for (i = 0; i < experienceMass.length; i++) {
		app.get(experienceMass[i], function(request, response) { getExperiencePage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/experience';
	}

	var docsMass = new Array('/docs.html', '/docs.htm', '/docs');
	for (i = 0; i < docsMass.length; i++) {
		app.get(docsMass[i], function(request, response) { getDocsPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/docs';
	}

	var contactsMass = new Array('/contacts.html', '/contacts.htm', '/contacts', '/contact-info.html', '/contact-info.htm', '/contact-info');
	for (i = 0; i < contactsMass.length; i++) {
		app.get(contactsMass[i], function(request, response) { getContactsPage(request, response); });
	}
	if (i > 0) {
		sitemapMass[sitemapMass.length] = '/contacts';
	}
}

initGetPages();

app.get('/favicon.ico', function(request, response){
	response.writeHead(200, {"Content-Type": "image/x-icon"});
	var img = fs.readFileSync('./images/favicon.ico');
    response.end(img, 'binary');
});

app.get('/robot', function(request, response) {
	console.log("robot redirect to robots.txt");
	response.redirect(301, "/robots.txt");
	//response.writeHead() // 301 Moved Permanently
});

app.get('/robots.txt', function(request, response){
	console.log("robots.txt redirect");
	response.writeHead(200, {"Content-Type": "text/plain"});
	var text = fs.readFileSync('./input/robots.txt','utf8');
	response.write(text);
    response.end(); 
});

app.get('*', function(request, response){
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write("<html><head><title>Ошибка 404</title></head><body><h1>Ошибка&nbsp;404</h1></body></html>");
	response.end();
});

app.listen(8882);