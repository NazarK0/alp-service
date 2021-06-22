var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var fs = require("fs");
var fest = require("fest");

var pageGen = require('./pageGenerators.js');
var helper = require('./session-helper.js');

// init Express app
var app = express();
app.use(cookieParser()); // must use cookieParser before expressSession
app.use(expressSession({ secret: helper.makeID() }));
app.use(bodyParser());

var Element = (function(baseUrl, callback) {

	// Constructor
 	var elem = function (baseUrl, callback) {
 		//console.log(baseUrl);
 		if (typeof baseUrl === "string") {
 			this.urlMass = new Array();
 			this.urlMass[this.urlMass.length] = baseUrl; // фактически: this.urlMass[0] = baseUrl
 		} else {
 			throw "Element: bad baseUrl parameter";
 		}

 		if (typeof callback === "function") {
 			app.get(baseUrl,  callback);
 		} else {
 			throw "Element: bad callback parameter";
 		}

		this.testUrl = function(url) {
			var result = false;
			if (typeof url === "string") {
				for (var i = 0; i < this.urlMass.length; i++) {
					//console.log("testUrl " + this.urlMass[i] + " " + url);
					if (this.urlMass[i] == url) {
						
						result = true;
						break;
					}
				}
			}
			return result;
		}

 		this.addUrlSynonim = function(url) {
 			var result = false;
 			if (typeof url === "string") {
 				if (this.testUrl(url) == false) {
 					this.urlMass[this.urlMass.length] = url;
 					
 					app.get(url, function(request, response) {
 						console.log("redirect from " + url);
						response.redirect(301, baseUrl); // HTTP 301 "Moved Permanently"
					});
 				}
			}
			return result;
 		}

 		this.getBaseUrl = function() {
 			return baseUrl;
 		}
    };
    
    return elem;

})();

// var router = new Router();
// (+) router.addUrl("/test", function(request, response){	response.send(pageGen.getContactsPage()); });
// (+) router.addSynonim("/test", "/test.html");
// (?) router.addSynonim("/test", new Array('/index.html', '/index.htm', '/index'));
var Router = (function() {

	// Constructor
 	var router = function () {
 		this.elements = new Array();

		this.findElement = function(url) {
			var resultElement = undefined;
			if (typeof url === "string") {
				for (var i = 0; i < this.elements.length; i++) {
					var el = this.elements[i];
					if (url === el.getBaseUrl()) {
						resultElement = el;
						break;
					}
				}
			} else {
	 			throw "Router.findElement(): bad url parameter";
	 		}
	 		return resultElement;
		}

 		this.addUrl = function(url, callback) {
 			var result = false;
	 		if (typeof url === "string") {
	 			var el = this.findElement(url);
	 			if (typeof el === "undefined") {
	 				if (typeof callback === "function") {
	 					this.elements[this.elements.length] = new Element(url, callback);
	 					result = true;
	 				} else {
	 					throw "Element: bad callback parameter";
	 				}
	 			}
	 		} else {
	 			throw "Router.addUrl(): bad url parameter";
	 		}
			return result;
 		}

 		this.addSynonim = function(url, urlSynonim) {
 			var result = false;
 			var el = this.findElement(url);
 			//console.log("addSynonim: " + el.getBaseUrl());
 			if (typeof el !== "undefined") {
 				var r = true;
 				for (var i = 0; i < this.elements.length; i++) {
 					//console.log("addSynonim " + urlSynonim +" " + i);
					if (this.elements[i].testUrl(urlSynonim)) {
						r = false;
					}
 				}
 				if (r) { // адреса urlSynonim не найдено во всех Element (this.elements)
 					el.addUrlSynonim(urlSynonim);
 					result = true;
 				} else {
 					throw "Router.addSynonim(): urlSynonim already exists in this.elements"
 				}
 			} else {
 				throw "Router.addSynonim(): No Element with baseUrl = url";
 			}
 			return result;
		}
 	};
 	
 	return router;
})();

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
function getFasadnyeRabotyPage(request, response) {
	var html = pageGen.getFasadnyeRabotyPage();
	response.send(html);
}
function getObespylivaniePage(request, response) {
	var html = pageGen.getObespylivaniePage();
	response.send(html);
}
function getKliningPage(request, response) {
	var html = pageGen.getKliningPage();
	response.send(html);
}
function getUborkaSnegaPage(request, response) {
	var html = pageGen.getUborkaSnegaPage();
	response.send(html);
}
function getVidyRabotPage(request, response) {
	var html = pageGen.getVidyRabotPage();
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
function defaultPage(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<html><head><title>Default Page</title></head><body><h1>Default Page</h1></body></html>");
	response.end();
}

function getCallback(id) {
	console.log("start getCallback(): " + id);
	var result = defaultPage;
	if (typeof id === "string") {
		switch (id) {
			case "index":
				result = getIndexPage;
				break;
			case "ceny":
				result = getVidyRabotPage;
				break;
			case "docs":
				result = getDocsPage;
				break;
			case "experience":
				break;
			case "contacts":
				result = getContactsPage;
				break;
			case "service":
				result = getServicePage;
				break;
			case "service krov":
				result = getKrovelnyeRabotyPage;
				break;
			case "service germ":
				result = getGermetizaciyaShvovPage;
				break;
			case "service fasad":
				result = getFasadnyeRabotyPage;
				break;
			case "service obes":
				result = getObespylivaniePage;
				break;
			case "service klin":
				result = getKliningPage;
				break;
			case "service sneg":
				result = getUborkaSnegaPage;
				break;
			default:
				result = defaultPage;
				console.log("start router getCallback(): default page (id=\"" + id + "\")");
		}
	}
	return result;
}

var r = new Router();
var urlsData = fs.readFileSync("input/urls.json", "utf8");
var json = JSON.parse(urlsData);
for (var i = 0; i < json["router"].length; i++) {
	try {
		r.addUrl(
			json["router"][i]["url"],
			getCallback(json["router"][i]["id"])
		);
		for (var j = 0; j < json["router"][i]["synonim"].length; j++) {
			try {
				r.addSynonim(
					json["router"][i]["url"],
					json["router"][i]["synonim"][j]["url"]
				);
			} catch(e) {
				console.log(e);
			}
		}
	} catch(e) {
		console.log(e);
	}
}

app.get('/experience/*', function(request, response) {
	var expUrl = "/experience/";
	var address = request.path.toLowerCase().slice(expUrl.length, request.path.length);
	address = address.split("/")[0]; // Сейчас берётся в расчёт только первая часть адреса (адрес до очередного символа "/").

	var jsonExpPages = JSON.parse(fs.readFileSync("input/experience/1.01-urls.json", "utf8"));
	var urls = jsonExpPages["experience-urls"];

	if (address == "") {
		address = "root";
	}

	var key = urls[address];
	if (key !== "" || key !== "undefined") {
		console.log("url: [" + address + "] url: " + key.type);

		var html= fest.render("templates/pages/" + address + "/experience-page.xml", json);
		response.send(html);


	} else {
		console.log("Warning! Key is undefined.");
	}
	


});

app.get('/experience', function(request, response) {
	response.redirect(301, "/experience/");
});


app.get('/partners',  function(request, response){
	var html = pageGen.getPartnersPage();
	response.send(html);	
});
app.get('/partners/peterburgskaya-nedvizhimost',  function(request, response){
	var html = pageGen.getPartnersPeterburgNedvPage();
	response.send(html);	
});


app.get('/favicon.ico', function(request, response){
	response.writeHead(200, {"Content-Type": "image/x-icon"});
	var img = fs.readFileSync('./images/favicon.ico');
    response.end(img, 'binary');
});

app.get('/robot', function(request, response) {
	console.log("robot redirect to robots.txt");
	response.redirect(301, "/robots.txt"); // HTTP 301 Moved Permanently
});

app.get('/robots.txt', function(request, response){
	console.log("robots.txt redirect");
	response.writeHead(200, {"Content-Type": "text/plain"});
	var text = fs.readFileSync('./input/robots.txt','utf8');
	response.write(text);
    response.end(); 
});

app.get('/sitemap.xml', function(request, response){
	response.writeHead(200, {"Content-Type": "text/xml"});
	var xml = pageGen.getSitemapPage();
	response.write(xml);
	response.end();
});

// Раздача статических файлов
app.use("/images", express.static('./images'));
app.use("/styles", express.static('./styles'));
app.use("/scripts", express.static('./scripts'));

app.get('*', function(request, response){
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write( pageGen.get404Page() );
	//response.write("<html><head><title>Ошибка 404</title></head><body><h1>Ошибка&nbsp;404</h1></body></html>");
	response.end();
});

app.listen(8882);