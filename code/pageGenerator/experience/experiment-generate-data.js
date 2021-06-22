/*
    Author: Victor Ivanov
    Created: 2016-04-22
    Экспериментальный файл для отладки работы программы в файле 'page-experience.js'.
    Создаётся набор данных для отрисовки блоков с категориями ("Виды работ") для страниц 'experience-page-category'.

 */

function createBlocks() {
    var blocks = [];
    blocks[blocks.length] = newBlock("Все работы", ["Один", "Два", "Три"], "Один");
    blocks[blocks.length] = newBlock("Один", ["Один.Один", "Один.Два", "Один.Три"], "Один.Три");
    blocks[blocks.length] = newBlock("Один.Три", ["Один.Три.Один", "Один.Три.Два", "Один.Три.Три"], "");

    return blocks;
}

function newBlock(categoryName, categoryChildrenMass, markedChildName) {
    var b = {};
    b["category"] = categoryName;
    b["children"] = [];
    for (var i in categoryChildrenMass) {
        b.children[b.children.length] = {
            url: "/url",
            title: categoryChildrenMass[i] + " Title",
            class: (categoryChildrenMass[i] == markedChildName) ? "marked" : "",
            name: categoryChildrenMass[i]
        }
    }
    return b;
}

exports.createBlocks = createBlocks;