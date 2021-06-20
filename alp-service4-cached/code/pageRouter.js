var index = require("./pageGenerator/page-index.js");
var partners = require("./pageGenerator/partners/page-partners.js");
var experience = require("./pageGenerator/experience/page-experience.js");
var defaultPage = require("./pageGenerator/page-default.js");
var serviceCompiler = require("./pageGenerator/compile-service-ids.js");
var ceny = require("./pageGenerator/ceny/page.js");
var contacts = require("./pageGenerator/contacts/page.js");
var service = require("./pageGenerator/service/page.js");

function route(address) {
    var result = {
        html: "",
        code: 404,
        url: ""
    };

    var pageInfo = parseAddress(address);
    switch (pageInfo.group) {
        case "index":
            result.html = index.getPage();
            result.code = 200;
            break;
        case "partners":
            result.code = partners.getPageCode(pageInfo.element);
            result.html = partners.getPage(pageInfo.element);
            break;
        case "experience":
            result.code = experience.getPageCode(pageInfo.element);
            switch (result.code) {
                case 200:
                    result.html = experience.getPage(pageInfo.element);
                    break;
                case 301:
                    result.url = experience.getPage(pageInfo.element);
                    break;
                default:
                case 404:
                    result.html = defaultPage.get404();
            }
            break;
        case "ceny":
            result = ceny.getPage(pageInfo.element);
            if (result.code == 404) {
                result.html = defaultPage.get404();
            }
            break;
        case "contacts":
            result = contacts.getPage(pageInfo.element);
            if (result.code == 404) {
                result.html = defaultPage.get404();
            }
            break;
        case "service":
            result = service.getPage(pageInfo.element);
            if (result.code == 404) {
                result.html = defaultPage.get404();
            }
            break;
        case "":
            // testUrlForHttp301()
        default:
            result.html = defaultPage.get404();
            result.code = 404;
    }
    return result;
}

function parseAddress(address) {
    var result = {
        group: "",
        element: ""
    };
    if (address == "/") {
        result.group = "index";
        result.element = "";
    } else {
        // Очень-очень-очень условный синтаксический разбор строки.
        var mass = address.split("/");
        console.log(mass);
        result.group = mass[1];
        if (mass.length >= 3) {
            result.element = mass[2];
        }
    }

    return result;
}

// ----------------------------------------------------------------------------
// Выполнение сборки/компиляции данных для страниц разделов.
function initCompilers() {
    var result = 0;
    var err = serviceCompiler.initCompilers(); //compileParents() ? 0 : 1;
    if (err !== 0) {
        console.log("initCompiler: serviceCompiler - errors: " + err);
        result += err;
    }
    err = experience.initCompilers();
    if (err !== 0) {
        console.log("initCompiler: experience - errors: " + err);
        result += err;
    }
    err = ceny.initCompilers();
    if (err !== 0) {
        console.log("initCompiler: ceny - errors: " + err);
        result += err;
    }
    return result;
}
// ----------------------------------------------------------------------------
exports.route = route;
exports.initCompilers = initCompilers;