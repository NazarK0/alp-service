/*
    GETTER: /
    "Хлебные крошки" для разделов.
 */

function getBasic() {
    var b = [];
    b[0] = {
        url: "/",
        name: "Компания",
        title: "Промышленные альпинисты в СПБ",
        class: "",
        delimiter: "/"
    };
    /*b[1] = {
        url: "/partners",
        name: "Наши партнёры",
        title: "Партнёры компании «Альп-Сервис»",
        class: "",
        delimiter: "/"
    };*/
    return b;
}

function addBreadcrumb(mass, url, name, title) {
    mass[mass.length] = {
        url: url,
        name: name,
        title: (title !== "") ? title : name,
        class: "",
        delimiter: "/"
    };
}

function checkDelimiters(mass) {
    for (var i in mass) {
        mass[i].class = ""; // Потенциально опасные обращения - нет никаких проверок.
        mass[i].delimiter = "/";
    }
    mass[mass.length - 1].class = "simple";
    mass[mass.length - 1].delimiter = "";
}

exports.getBasic = getBasic;
exports.checkDelimiters = checkDelimiters;
exports.addBreadcrumb = addBreadcrumb;