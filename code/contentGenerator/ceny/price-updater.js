/*
    Author: Victor Ivanov
    Created: 2016-05-16
    Updated: 2016-05-17
*/
var JS_FILE = "price-updater.js";

var fs = require("fs");
const pathNode = require("path");
// ----------------------------------------------------------------------------
var etc = {
    naline: "—",
    vyezd: "необходим выезд оценщика"
};
var unit = {
    NA: etc.naline,
    MP: "метр погонный",
    MK: "метр квадратный",
    MPK: "метр кв./погонный",
    SH: "штука",
    MPS: "метр погонный/шт.",
    TN: "тонна"
};
var price = {
    na: function() {
        return this.getValue(unit.NA, etc.naline);
    },
    mp : function(value) {
        return this.getValue(unit.MP, value);
    },
    mk: function(value) {
        return this.getValue(unit.MK, value);
    },
    mpk: function(value) {
        return this.getValue(unit.MPK, value);
    },
    sh: function(value) {
        return this.getValue(unit.SH, value);
    },
    mps: function(value) {
        return this.getValue(unit.MPS, value);
    },
    tn: function(value) {
        return this.getValue(unit.TN, value);
    },
    getValue: function(unit_value, price_value) {
        return {
            u: unit_value,
            v: price_value
        };
    }
};
console.log(price.mk("от 100"));
// ----------------------------------------------------------------------------
// Формируются данные для файла 'price-data.json'.
function getPriceDataList() {
    var list = {};
    var id = "";
    var pls = [];
    var sid = "";
    var name = "";
    //list["PD-germ-kvartira"]        = createLine("Герметизация квартир", "germ", "", "MP", "от 250");

    sid = "";
    pls = ["fasad"]; // 'fasad' @ price-lists.json
    {
        id = "PD-fasad-starkraska";
        list[id] = createLine("Очистка от старой краски шпателями и щётками", pls, sid, price.mk("от 30"));

        id = "PD-fasad-starshtukatur";
        list[id] = createLine("Очистка от старой штукатурки (отбивка)", pls, sid, price.mk("от 75"));

        id = "PD-fasad-remtreshin";
        list[id] = createLine("Ремонт трещин (расшивка и шпатлёвка)", pls, sid, price.mk("от 70"));

        id = "PD-fasad-udalvysol";
        list[id] = createLine("Удаление высолов", pls, sid, price.mk("от 200"));

        id = "PD-fasad-shpatlevka";
        list[id] = createLine("Шпатлёвка", pls, sid, price.mk("от 270"));

        id = "PD-fasad-shtukaturka";
        list[id] = createLine("Штукатурка", pls, sid, price.mk("от 500"));

        id = "PD-fasad-peskostruj";
        list[id] = createLine("Пескоструйная очистка фасада", pls, sid, price.mk("от 150"));

        id = "PD-fasad-pokras";
        list[id] = createLine("Покрасочные работы", pls, sid, price.na());

        id = "PD-fasad-gruntovka";
        list[id] = createLine("Грунтовка фасада", pls, sid, price.mk("от 40"));

        id = "PD-fasad-otd-pokraska-odin";
        sid = "fasad-otd-pokraska";
        list[id] = createLine("Покраска фасада в один слой", pls, sid, price.mk("от 80"));

        id = "PD-fasad-otd-porkaska-dva";
        sid = "fasad-otd-pokraska";
        list[id] = createLine("Покраска фасада в два слоя", pls, sid, price.mk("от 150"));

        sid = "";

        id = "PD-fasad-pokraka-okon";
        list[id] = createLine("Покраска оконных рам", pls, sid, price.mp("от 300"));

        id = "PD-fasad-pokraka-okon-reshetka";
        list[id] = createLine("Покраска оконных рам с решётками", pls, sid, price.mp("от 500"));

        id = "PD-fasad-pokraska-metallokstr";
        list[id] = createLine("Покраска металлоконструкций", pls, sid, price.mpk("от 90"));

        id = "PD-fasad-hydrofobization";
        list[id] = createLine("Гидрофобизация фасада", pls, sid, price.mk("от 100"));

        id = "PD-fasad-uteplenie";
        list[id] = createLine("Утепление фасадов", pls, sid, price.na());

        id = "PD-fasad-mokrye-fasady";
        list[id] = createLine("Мокрые фасады", pls, sid, price.mk("—"));

        /*
        id = "";
        list[id] = createLine("", pls, sid, price.ddd(""));
        */

        sid = "";
    }

    sid = "dop";
    pls = ["dop"]; // 'dop' @ price-lists.json
    {
        id = "PD-dop-valka-dereva";
        list[id] = createLine("Валка дерева", pls, sid, price.sh("от 3000"));

        id = "PD-dop-udalenie-dereva-po-chastyam";
        list[id] = createLine("Удаление дерева по частям", pls, sid, price.sh("от 8000"));

        id = "PD-dop-udalenie-dereva-s-zavesh";
        list[id] = createLine("Удаление дерева по частям с завешиванием и спуском", pls, sid, price.sh("от 10000"));

        id = "PD-dop-kronirovanie";
        list[id] = createLine("Омолаживающая обрезка (кронирование)", pls, sid, price.sh("от 2500"));

        id = "PD-dop-podnyatie-krony";
        list[id] = createLine("Поднятие кроны (удаление веток)", pls, sid, price.sh("от 800"));

        id = "PD-dop-truby-obsledovanie";
        list[id] = createLine("Обследование дымовых труб", pls, sid, price.na());

        id = "PD-dop-dostup-v-pomesheniya";
        list[id] = createLine("Доступ в помещения", pls, sid, price.sh("от 5000"));

        id = "PD-dop-podarok-v-okno";
        list[id] = createLine("«Подарок в окно»", pls, sid, price.sh("от 5000"));

        id = "PD-dop-ded-moroz-v-okno";
        list[id] = createLine("«Дед мороз в окно»", pls, sid, price.sh("от 5000"));

        id = "PD-dop-gruz-podjemspusk-negabarit";
        list[id] = createLine("Подъём/спуск негабаритных грузов", pls, sid, price.na());

        id = "PD-dop-gruz-podjemspusk-do100kg";
        list[id] = createLine("Подъём/спуск груза весом до 100 кг", pls, sid, price.sh("от 5000"));

        id = "PD-dop-gruz-podjemspusk-do200kg";
        list[id] = createLine("Подъём/спуск груза весом до 200 кг", pls, sid, price.sh("от 17000"));

        id = "PD-dop-gruz-podjemspusk-do300kg";
        list[id] = createLine("Подъём/спуск груза весом до 200 кг", pls, sid, price.sh("от 29000"));

        id = "PD-dop-gruz-podjemspusk-ot300kg";
        list[id] = createLine("Подъём/спуск груза весом от 300 кг", pls, sid, price.sh(etc.vyezd));

        /*
        id = "";
        list[id] = createLine("", pls, sid, price.ddd(""));
        */

        sid = "";
    }

    pls = ["clean", "clean-mojka"]; // 'clean-mojka' @ price-lists.json
    {
        id = "PD-clean-mojka-fasadnoe-osteklenie";
        name = "Мойка фасадного остекления";
        list[id] = createLine(name, pls, sid, price.mk("от 20"));

        id = "PD-clean-mojka-vert-stekol";
        name = "Высотная мойка вертикальных стёкол";
        list[id] = createLine(name, pls, sid, price.mk("от 35"));

        id = "PD-clean-mojka-horiz-stekol";
        name = "Высотная мойка горизонтальных стёкол";
        list[id] = createLine(name, pls, sid, price.mk("от 45"));

        id = "PD-clean-mojka-fasad-appvysokdavl";
        name = "Мойка фасадов (аппарат высокого давления)";
        list[id] = createLine(name, pls, sid, price.mk("от 25"));

        id = "PD-clean-mojka-fasad-appvysokdavl-shetki";
        name = "Мытьё фасадов аппаратом высокого давления с использованием моющего средства и щёток";
        list[id] = createLine(name, pls, sid, price.mk("от 40"));

        id = "PD-clean-mojka-pomyvka-bannera";
        name = "Помывка баннера, световой коробки";
        list[id] = createLine(name, pls, sid, price.mk("от 240"));

        id = "PD-clean-mojka-okna-vitriny-vyveski";
        name = "Мойка окон, витрин и рекламных вывесок";
        list[id] = createLine(name, pls, sid, price.mk("от 30"));

        /*
        id = "";
        list[id] = createLine("", pls, sid, price.ddd(""));
        */

        sid = "";
        name = "";
    }

    sid = "";
    pls = ["demont"]; // 'demont' @ price-lists.json
    {
        id = "PD-demont-vent";
        name = "Демонтаж систем вентиляции";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        /*
        id = "PD-demont-vodostok";
        name = "Демонтаж водостоков";
        list[id] = createLine(name, pls, sid, price.na());
        */

        id = "PD-demont-metal";
        name = "Демонтаж металлоконструкций";
        list[id] = createLine(name, pls, sid, price.tn("от 15000"));

        id = "PD-demont-kirpich-truba";
        name = "Демонтаж кирпичных труб";
        list[id] = createLine(name, pls, sid, price.mp("от 10000"));

        id = "PD-demont-beton-truba";
        name = "Демонтаж бетонных труб";
        list[id] = createLine(name, pls, sid, price.mp("от 20000"));

        id = "PD-demont-metal-trub";
        name = "Демонтаж металлических труб";
        list[id] = createLine(name, pls, sid, price.mp("от 3000"));

        id = "PD-demont-bashen-i-vyshek-svyazi";
        name = "Демонтаж башен и вышек связи";
        list[id] = createLine(name, pls, sid, price.mp("от 3000"));

        id = "PD-demont-angar";
        name = "Демонтаж ангаров";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        id = "PD-demont-reklama";
        name = "Демонтаж рекламных конструкций";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        id = "PD-demont-stroitelnye-lesa";
        name = "Демонтаж строительных лесов";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: "от 60"});

        /*
        id = "";
        name = "";
        list[id] = createLine(name, pls, sid, price.ddd(""));
        */

        sid = "";
        name = "";
    }

    sid = "";
    pls = ["mont"]; // 'mont' @ price-lists.json
    {
        id = "PD-mont-vent";
        name = "Монтаж систем вентиляции";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        id = "PD-mont-vinil-brandmauer";
        name = "Монтаж виниловых брандмауэров, банеров (без рамы)";
        list[id] = createLine(name, pls, sid, price.mk("от 350"));

        id = "PD-mont-banner";
        name = "Монтаж баннеров (с монтажом конструкции)";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        id = "PD-mont-neon";
        name = "Монтаж неона";
        list[id] = createLine(name, pls, sid, price.mp("от 280"));

        id = "PD-mont-bukvy-1m";
        name = "Монтаж объёмных букв (1м. x 1м.)";
        list[id] = createLine(name, pls, sid, price.sh("от 1100"));

        id = "PD-mont-bukvy-05m";
        name = "Монтаж объёмных букв (0,5м. x 0,5м.)";
        list[id] = createLine(name, pls, sid, price.sh("от 450"));

        id = "PD-mont-duralait";
        name = "Монтаж дюралайта";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: "от 180"});

        id = "PD-mont-svetkorob";
        name = "Монтаж светового короба";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: "от 1200"});

        id = "PD-mont-ng-ukrasheniya";
        name = "Монтаж новогодних украшений";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        id = "PD-mont-lampochki";
        name = "Замена электрических лампочек";
        list[id] = createLine(name, pls, sid, price.sh("от 30"));

        id = "PD-mont-kamery";
        name = "Установка камер видеонаблюдения";
        list[id] = createLine(name, pls, sid, price.sh("от 3000"));

        id = "PD-mont-kondicioner";
        name = "Монтаж внешних блоков кондиционеров";
        list[id] = createLine(name, pls, sid, price.sh("3500"));

        id = "PD-mont-sputnik";
        name = "Монтаж снутниковых антенн";
        list[id] = createLine(name, pls, sid, price.sh("от 6000"));

        id = "PD-mont-kabel-antennyj";
        name = "Монтаж антенного кабеля";
        list[id] = createLine(name, pls, sid, price.mp("от 60"));

        id = "PD-mont-kabel-termo";
        name = "Монтаж термокабеля";
        list[id] = createLine(name, pls, sid, price.mp("от 200"));

        id = "PD-mont-kabel-electro";
        name = "Монтаж электропроводки";
        list[id] = createLine(name, pls, sid, price.mp("от 80"));

        id = "PD-mont-kabel-molniya";
        name = "Монтаж молниезащиты (громоотвод)";
        list[id] = createLine(name, pls, sid, price.mp("от 120"));

        id = "PD-mont-stroilenye-lesa";
        name = "Монтаж строительных лесов";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: "от 100"});

        id = "PD-mont-geberit";
        name = "Монтаж ливневой канализации Geberit";
        list[id] = createLine(name, pls, sid, {u: unit.NA, v: etc.vyezd});

        /*
        id = "";
        name = "";
        list[id] = createLine(name, pls, sid, price.ddd(""));

            Монтаж небольших прожекторов (до 1 кг)	штука	от 1500 рублей
            Монтаж больших прожекторов (свыше 1 кг)	штука	от 1500 рублей
            Монтаж металлоконструкций	тонна	от 15000 рублей
            Монтаж антенн, столбов, мачт и прочих конструкций	тонна	от 20000 рублей
            Монтаж сэндвич-панелей	метр квадратный	от 300 рублей
            Монтаж и ремонт зимних садов, балконов и окон	—	необходим выезд оценщика
            Монтаж декоративных элементов (французских балконов)	—	необходим выезд оценщика
         */

        sid = "";
        name = "";
    }

    sid = "";
    pls = ["clean", "clean-posle"]; // 'clean-posle' @ price-lists.json
    {
        id = "PD-clean-posle-mojkaostekleniya";
        name = "Мойка остекления после ремонта";
        list[id] = createLine(name, pls, sid, price.mk("от 20"));

        id = "PD-clean-posle-lift";
        name = "Мойка остекления лифтовых шахт";
        list[id] = createLine(name, pls, sid, price.mk(etc.vyezd));

        id = "PD-clean-posle-mramor";
        name = "Чистка мрамора";
        list[id] = createLine(name, pls, sid, price.mk(etc.vyezd));

        id = "PD-clean-posle-obespylivanie";
        name = "Обеспыливание поверхностей после ремонта";
        var pls1 = ["clean", "clean-posle", "clean-obesp"];
        list[id] = createLine(name, pls1, sid, {u: unit.NA, v: etc.vyezd});

        /*
        id = "";
        name = "";
        list[id] = createLine(name, pls, sid, price.ddd(""));
        */

        sid = "";
        name = "";
    }


    return list;
}
// ----------------------------------------------------------------------------
function update_PriceData() {
    var j = getJsonData(pathNode.join(__dirname, "../../../content/ceny/price-data.json"));
    if (j !== false) {
        console.log ("[" + j["_file_comment"] + "]");

        var oList = j.list;
        var nList = getPriceDataList();
        for (var i in nList) {
            oList[i] = nList[i];
        }

        fs.writeFileSync(pathNode.join(__dirname, "../../../content/ceny/price-data-compiled.json", JSON.stringify(j, null, 4)));
    } else {
        console.log("err");
    }
}
// ----------------------------------------------------------------------------
function createLine(n, pLists, serviceId, price) {
    return {
        name:           n,
        pricelists :    pLists,
        service_id:     serviceId,
        unit:           price.u,
        price_value:    price.v
    };
}
// ----------------------------------------------------------------------------
function getJsonData(file) {
    var result = false;
    try {
        result = JSON.parse(
            fs.readFileSync(pathNode.resolve(file))
        );
    } catch (err) {
        console.log(JS_FILE + " getJsonFile(): ERROR! Cannot open file: '" + file + "'");
        result = false;
    }
    return result; // Если возвращется тип boolean, то функция завершилась с ошибкой.
}
// ----------------------------------------------------------------------------

update_PriceData();