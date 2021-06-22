/*
    Author: Victor Ivanov <victorivanov.spb@gmail.com>
    Created: 2016-05-10
    Updated: 2016-05-16

    Компиляция данных в раздел 'compiled-data' - выполнение подготовительных работ
    для последующего запуска веб-сервера с кэшированием: server-cached-...

    compileUrls.js
*/

var fs = require("fs");
var router = require("./pageRouter.js");
var fest = require('fest');
const pathNode = require('path');
// ----------------------------------------------------------------------------
function compile() {
    try {
        // Шаг 1
        compileTest(createBlocks());

        // Шаг 2
        compileTest(createRoutes());

        // Шаг 3 - наполнение файлов данным
        fillData();

        // Шаг 4 - создание Sitemap.xml
        createSitemap();

    } catch (err) {
        console.log(err);
    }
}
// ----------------------------------------------------------------------------
function compileTest(errValue) {
    if (errValue > 0) {
        throw "compileTest(): Error!"
    }
}
// ----------------------------------------------------------------------------
function createSitemap() {
    console.log("createSitemap()");

    var j = getFile(pathNode.join(__dirname, "../compiled-data/routes-compiled.json"));
    if (j) {
        var json = [];
        var date = getCurrentDate();
        console.log("date=" + date);

        for (var url in j.urls) {

            var line = {
                loc: "http://alp-service.ru" + url,
                lastmod: date,
                changefreq: "weekly",
                priority: "0.8"
            };

            var path = j.urls[url];
            var m = path.split("/");
            var dir = "";
            for (var ii=0; ii < m.length - 1; ii++) {
                dir += m[ii] + "/";
            }
            if (m[m.length - 1] == "index.html") {
                line.priority = "1.0";
                line.changefreq = "daily";
            }

            json[json.length] = line;
        }

        var xml = fest.render(pathNode.join(__dirname, "../templates/sitemap.xml"), json);
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/sitemap.xml"), xml);
    }
}
// ----------------------------------------------------------------------------
function fillData() {
    console.log("fillData()");
    var j = getFile(pathNode.join(__dirname, "../compiled-data/routes-compiled.json"));
    
    if (j) {
        for (var url in j.urls) {
            var answer = router.route(url);

            switch (answer.code) {
                case 200:

                    var path = j.urls[url];
                    console.log(path);
                    var m = path.split("/");
                    var dir = "";
                    for (var ii=0; ii < m.length - 1; ii++) {
                        dir += m[ii] + "/";
                    }
                    console.log(dir);
                    checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/", dir));
                    fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/", path), answer.html);
                    break;

                case 404:
                    console.log("Err 404! | " + path);
                    break;

                case 301:
                    console.log("Redirect 301! | " + path);
                    break;
            }
        }

        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/", j.http404), router.route("error404").html); //vs
    } else {
        console.log("fillData(): Error!");
    }
}
// ----------------------------------------------------------------------------
function createBlocks() {
    printLine();
    var err = 0;
    err += (createExperienceBlock() == false) ? 0 : 1;
    printLine();
    err += (createServiceBlock()    == false) ? 0 : 1;
    printLine();
    err += (createCenyBlock()       == false) ? 0 : 1;
    printLine();
    err += (createPartnersBlock()   == false) ? 0 : 1;
    printLine();
    err += (createContactsBlock()   == false) ? 0 : 1;
    printLine();

    console.log("Errors sum=[" + err + "]");
    return err;
}
// ----------------------------------------------------------------------------
function createRoutes() {
    var routes = {
        urls: {},
        http301: {},
        http404: ""
    };
    routes = openRootUrls(routes);
    console.log(routes, 'COMPILE ROUTES')

    var b = getBlocks();
    for (var i in b) {
        console.log(i + " " + b[i]);
        routes = openBlockUrls(routes, b[i]);
    }

    fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/routes-compiled.json"), JSON.stringify(routes, null, 4));
    return 0;

}
// ----------------------------------------------------------------------------
function openRootUrls(routes) {
    printTag("BEGIN", "openRootUrls");

    var j = getFile(pathNode.join(__dirname, "../compiled-data/urls.json"));
    if (j) {
        routes.urls[ "/" ] = "html/index.html";
        routes.http301 = j.http301;
        routes.http404 = j.http404;
    }

    printTag("END", "openRootUrls");
    return routes;
}
function getBlocks() {
    printTag("BEGIN", "getBlocks");
    var mass = [];

    var j = getFile(pathNode.join(__dirname, "../compiled-data/urls.json"));
    if (j) {
        mass = j.blocks;
    }

    printTag("BEGIN", "getBlocks");
    return mass;
}
function openBlockUrls(routes, block) {
    printTag("BEGIN", "openBlockUrls");
    var j = getFile(pathNode.join(__dirname, "../compiled-data/blocks/", block, "/urls.json"));
    if (j) {
        for (var i in j.urls) {
            console.log("===/" + block + "/" + j.urls[i]);
            routes.urls["/" + block + "/" + j.urls[i]] = "html/" + block + "/" + ((j.urls[i] == "") ? "index" : j.urls[i]) + ".html";

            for (var ii in j.http301) {
                routes.http301["/" + block + "/" + ii] = "/" + block + "/" + j.http301[ii]; //routes.http301.concat(j.http301);
            }


        }
    } else {
        console.log("openBlockUrls(): Error!");
    }

    printTag("END", "openBlockUrls");
    return routes;
}
// ----------------------------------------------------------------------------
function printLine() {
    console.log("-------------------------------------------");
}
function printTag(tag, name) {
    console.log(name + " [" + tag + "]");
}
function printCB(tag, block) {
    console.log("createBlock [" + tag + "]: alp-service/" + block);
}
function createExperienceBlock() {
    console.log("createBlock [BEGIN]: alp-service/experience");
    var error = false;

    var res = [];
    var http301 = {};
    var path = "../content/experience/";
    try {
        res     = checkThis( addUrlsInRes(   res,       pathNode.join(__dirname, path, "works-urls-compiled.json"),          1) );//nv start
        res     = checkThis( addUrlsInRes(   res,       pathNode.join(__dirname, path, "categories-urls-compiled.json"),     2) );
        res     = checkThis( addRootInRes(   res,                                                    3) );
        http301 = checkThis( addHttp301(     http301,   pathNode.join(__dirname, path, "works-urls-http301.json"),           4) );
        http301 = checkThis( addHttp301(     http301,   pathNode.join(__dirname, path, "old-customers-urls-http301.json"),   5) );//nv end

        checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/blocks/experience"));
        var json = {};
        json["block"] = "experience";
        json["urls"] = res;
        json["http301"] = http301;
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/blocks/experience/urls.json"), JSON.stringify(json, null, 4)); //nv

    } catch (err) {
        console.log(err);
        error = true;
    }

    console.log("createBlock [END]: alp-service/experience");
    return error;
}
// ----------------------------------------------------------------------------
function createServiceBlock() {
    var block = "service";
    console.log("createBlock [BEGIN]: alp-service/" + block);
    var error = false;

    var res = [];
    var http301 = {};
    var path = "../content/";
    try {
        res = checkThis( getServiceRootUrls(res, pathNode.join(__dirname, path, "service-ids-compiled.json"), 1) ); //nv
        http301 = checkThis( addHttp301( http301, pathNode.join(__dirname, path + "old-service-urls-http301.json"), 2)); //nv

        checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/blocks/", block));//nv
        var json = {};
        json["block"] = block;
        json["urls"] = res;
        json["http301"] = http301;
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/blocks/", block, "/urls.json"), JSON.stringify(json, null, 4));//nv

    } catch (err) {
        console.log(err);
        error = true;
    }

    console.log("createBlock [END]: alp-service/" + block);
    return error;
}
// ----------------------------------------------------------------------------
function createCenyBlock() {
    var block = "ceny";
    printCB("BEGIN", block);
    var error = false;

    var res = [];
    var http301 = {};
    var path = pathNode.join(__dirname, "../content/ceny/"); //nv
    try {
        res = checkThis( addUrlsInPricelists(res, path + "price-lists.json", 1));
        http301 = checkThis( addHttp301( http301, path + "price-urls-http301.json", 2));

        checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/blocks/", block)); //nv
        var json = {};
        json["block"] = block;
        json["urls"] = res;
        json["http301"] = http301;
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/blocks/", block, "/urls.json"), JSON.stringify(json, null, 4)); //nv

    } catch (err) {
        console.log(err);
        error = true;
    }

    printCB("BEGIN", block);
    return error;
}
// ----------------------------------------------------------------------------
function createPartnersBlock() {
    var block = "partners";
    printCB("BEGIN", block);
    var error = false;

    var res = [];
    var http301 = {};
    var path = pathNode.join(__dirname, "../content/partners/"); //nv
    try {
        res = checkThis(  addUrlsInRes( res, path + "partners-urls.json", 1) );
        http301 = checkThis( addHttp301( http301, path + "partners-urls-http301.json", 2));

        checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/blocks/", block)); //nv
        var json = {};
        json["block"] = block;
        json["urls"] = res;
        json["http301"] = http301;
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/blocks/", block, "/urls.json"), JSON.stringify(json, null, 4)); //nv

    } catch (err) {
        console.log(err);
        error = true;
    }

    printCB("END", block);
    return error;
}
// ----------------------------------------------------------------------------
function createContactsBlock() {
    var block = "contacts";
    printCB("BEGIN", block);
    var error = false;

    var res = [];
    var http301 = {};
    var path = pathNode.join(__dirname, "../content/contacts/");
    try {
        res = checkThis(  addUrlsInRes( res, path + "contacts-urls.json", 1) );
        http301 = checkThis( addHttp301( http301, path + "contacts-urls-http301.json", 2));

        checkDirAndCreateIfNotExist(pathNode.join(__dirname, "../compiled-data/blocks/", block));
        var json = {};
        json["block"] = block;
        json["urls"] = res;
        json["http301"] = http301;
        fs.writeFileSync(pathNode.join(__dirname, "../compiled-data/blocks/", block, "/urls.json"), JSON.stringify(json, null, 4)); //nv

    } catch (err) {
        console.log(err);
        error = true;
    }

    printCB("END", block);
    return error;
}
// ----------------------------------------------------------------------------
function addUrlsInRes(mass, fileName, num) {
    var result = {
        state: "unknown",
        step: num,
        description: "",
        mass: mass
    };
    var j = getFile(fileName);
    if (j) {
        for (var i in j.list) {
            //console.log(i);
            mass[mass.length] = i;
        }
        result.state = "ok";
        result.mass = mass;
    } else {
        result.description = "[step=" + num + "] compileUrls.js: addUrlsInRes(): ERROR! " + fileName;
        result.state = "ERROR";
    }
    //result.state = "ok";
    return result;
}
// ----------------------------------------------------------------------------
function addRootInRes(mass, num) {
    var result = {
        state: "unknown",
        step: num,
        description: "",
        mass: mass
    };
    mass[mass.length] = "";
    result.state = "ok";
    result.mass = mass;
    return result;
}
// ----------------------------------------------------------------------------
function addUrlsInPricelists(mass, fileName, num) {
    var result = {
        state: "unknown",
        step: num,
        description: "",
        mass: mass
    };
    var j = getFile(fileName);
    if (j) {
        for (var i in j.list) {
            mass[mass.length] = j.list[i]["price_url"];
        }
        result.state = "ok";
        result.mass = mass;
    } else {
        result.description = "[step=" + num + "] compileUrls.js: addUrlsInPricelists(): ERROR! " + fileName;
        result.state = "ERROR";
    }

    return result;
}
// ----------------------------------------------------------------------------
function addHttp301(mass, fileName, num) {
    var result = {
        state: "unknown",
        step: num,
        description: "",
        mass: mass
    };
    var j = getFile(fileName);
    if (j) {
        for (var i in j.list) {
            mass[i] = j.list[i];
        }
        result.state = "ok";
        result.mass = mass;
    } else {
        result.description = "[step=" + num + "] compileUrls.js: addHttp301(): ERROR! " + fileName;
        result.state = "ERROR";
    }
    return result;
}
// ----------------------------------------------------------------------------
function getServiceRootUrls(mass, fileName, num) {
    var result = {
        state: "unknown",
        step: num,
        description: ""
    };
    var j = getFile(fileName);
    if (j) {
        var rootMass = [];
        rootMass[rootMass.length] = "root";
        rootMass = rootMass.concat( j.list["root"]["_children"] );
        rootMass = rootMass.concat( j.list["clean"]["_children"] );
        for (var i in rootMass) {
            mass[mass.length] = j.list[ rootMass[i] ].url;
        }
        result.state = "ok";
        result.mass = mass;
    } else {
        result.description = "[step=" + num + "] compileUrls.js: getServiceRootUrls(): ERROR! " + fileName;
        result.state = "ERROR";
    }
    return result;
}

// ----------------------------------------------------------------------------
function getFile(fileName) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(fileName)
        );
    } catch (err) {
        //console.log("compileUrls.js: getFile(): ERROR! Cannot open file=[" + fileName + "] " + err);
        result = false;
    }
    return result;
}
// ----------------------------------------------------------------------------
function getCurrentDate() {
    // Функция возвращает текущую дату в формате 'ГГГГ-ММ-ДД'.
    // Дата используется в процессе формирования файла 'sitemap.xml'.

    var date = new Date(); // Используется стандартный JS-объект Date.

    var m = date.getMonth() + 1; // 0 - январь, 1 - февраль, ...
    m = (m <= 9) ? "0" + m.toString() : m.toString();

    var d = date.getDate();
    d = (d <= 9) ? "0" + d.toString() : d.toString();

    return date.getFullYear() + "-" + m + "-" + d;
}
// ----------------------------------------------------------------------------
// answer = {
//    state: "ok" | "err",
//    step: 1...
// }
//
function checkThis(answer) {
    console.log("CHECK THIS: step=[" + answer.step + "] is " + answer.state + " " + answer.description);
    if (answer.state == "ERROR") {
        throw "checkThis(): Error!";
    }
    return answer.mass;
}

// ----------------------------------------------------------------------------
function checkDirAndCreateIfNotExist(path) {
    console.log(path, '=== CH PATH');
    var result = false;
    try {
        // Query the entry
        stats = fs.lstatSync(path);
        if (stats.isFile()) {
            result = false;
        } else if (stats.isDirectory()) {
            result = true;
        }
    }
    catch (e) {
        fs.mkdirSync(path, { recursive: true });
        result = true;
    }
    return result;
}

compile();
