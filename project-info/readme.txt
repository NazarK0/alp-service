-------------------------------------------------------------------------------
2016-03-12 был создан проект alp-service.ru/site-prototype

JS-код проекта имеет ряд зависимостей с модулями:
 - fest
 - express
 - express-session
 - body-parser
 - cookie-parser

Модули были установлены из Windows-консоли (в режиме Администратора):
# npm install -g fest
# npm install -g express
# npm install -g express-session
# npm install -g body-parser
# npm install -g cookie-parser

Далее из директории C:\Users\victor\AppData\Roaming\npm\node_modules все необходимые модули
были скопированы в директорию .\node_modules проекта
-------------------------------------------------------------------------------
header_content_styles @ templates/page.xml

Вариант загрузки шрифта PT-Sans с сервера Google:
<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700&amp;subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">-->

А также вариант загрузки шрифта из локальной директории:
<link href="/styles/fonts-googleapis-com-css.css" rel="stylesheet" type="text/css">
-------------------------------------------------------------------------------
2016-03-17
Собираю в один JSON-файл всю иерархическую структуру услуг: content/service-ids.json

Для удобства данные собираются в HTML-таблицу и выводятся вспомогательным кодом:
- code/experiment-service-ids-content.js
- templates/experiment-service-ids-content.xml
-------------------------------------------------------------------------------
2016-03-27
Архитектура файла content/service-ids.json ЗАФИКСИРОВАНА (версия: v.1).
-------------------------------------------------------------------------------
2016-04-02
Как работает выдача страниц на веб-сервере DEV (версия для разработки): server-dev.js

Главное отличие DEV-сервера от MAIN-сервера заключается в том, что DEV-сервер инициирует сборку HTML-страниц
в интерактивном режиме, что требует дополнительных ресурсов и времени. MAIN-сервер же осуществляет выдачу
предварительно скомпилированных HTML-страниц.

1. server-dev.js запускает веб-сервер на фреймворке Express. Указываются директории со статическими данными:
изображения, стили, JavaScript-библиотеки. Также могут указываться пути переадресации для устаревших страниц.

2. Все остальные запросы передаются в метод route (pageRoute.js) вместе адресной строкой. Роутер анализирует
адресную строку (метод parseAddress) и выбирает подходящий метод, собирающий HTML-данные из FEST-шаблонов и JSON-данных.

Притом, все методы, собирающие HTML-данные, находятся в директории code/pageGenerator и логически разделены. Работа с
JSON-данными осуществляется методами-обёртками в Getter-файлах (файлы в директории code/pageGenerator, имеющие префикс
getter).

Все JSON-данные хранятся в директории content.
-------------------------------------------------------------------------------
2016-04-08
Необходимы тесты для файлов с данными: чтобы проверять соответствие данных правилам формата.
Например, в файле "service-ids.json" можно легко проверять правописание всех id (есть ли опечатки, есть ли повторы).
-------------------------------------------------------------------------------
2016-04-13
Структура result (v.1) зафиксирована. Используется для подготовки данных к выводу в 'getter-servicelist.js'.

var result = {
    icon: "",
    name: "",
    url: "",
    price_name: "",
    price_url: "",
    children: []
};
-------------------------------------------------------------------------------
2016-04-21
Работаю с разделом experience.
1. Нарисовал эскиз страницы с категориями и списком работ в разделе /experience.
Виды работ представляют собой идущие друг по другом блоки от коревого раздела "Опыт работ" (с его дочками)
до текущего раздела (с его дочками). Притом, в каждом блоке выделяется дочка, являющаяся следующим
блоком.
2. Под вопросом: нужно ли на страницах "Опыт работ" делать большие картинки?
  - в категориях?
  - на страницах конкретных работ?
3. Загрузил простейший шаблон корневой страницы /experience без контента.
Нужен список всех заказчиков (без гиперссылок на них).
4. В page-experience.js нужно сделать:
  - compiler: categories-urls-compiled.json [СДЕЛАНО]
  - check workPage [СДЕЛАНО: checkPageType]
  - check categoryPage [СДЕЛАНО: checkPageType]

Что нужно сделать в ближайшее время:
  - см. выше
  - вывод блоков "Виды работ"
  - вывод страниц с категориями
  - вывод страниц с конкретными работам
  - HTTP301 для страниц заказчиков (в новой версии сайта этих страниц нет)
  - причесать стили
  - попробовать на страницах с конкр. работами выводить заголовок с большой картинкой
-------------------------------------------------------------------------------
2016-04-22
Продолжаю работать с разделом 'experience'.
1. Допустил и следом исправил ошибку в определении контекста шаблонов:
    В теге <fest:include> нужно указывать атрибут 'context', а не 'context_name'.
    Следовательно, с атрибутом 'context' правильно передаются значения (например, 'json.page.categories_blocks").
2. Шаблонизатор mailru/fest не позволяет "наследовать" шаблон двумя путями с разными контекстами.
    Опытным путём установил, что в двух путях определяется последний (второй) контекст.
    Было необходимо на корневой странице раздела 'experience' выводить два списка работ
    (соответственно, эти списки имеют одинаковую структуру) с разным содержимым (контексты).
3. Передалал страницы:
    - experience-page-root.xml (наследование от experience-page-category.xml)
    - block-categories-blocks.xml
    - block-works...
4. В программе 'pageGenerator/experience/page-experience.js' добавил вызов
    генератора данных 'pageGenerator/experience/experiment-generate-data.js',
    который создаёт временный набор данных для отрисовки блоков с категориями ("Виды работ").

Также нужно сделать:
  - см. выше
  - сконвертировать все уже готовые работы для раздела 'experience'.
-------------------------------------------------------------------------------
2016-04-25
1. В файле experience/getter-page-type.js сделана функция определения типа запрашиваемой страницы:
   checkPageType().

   Допустимые типы:
     - "root" (Корневая страница, принадлежащая к типу "category", но обрабатывающаяся отдельным образом).
     - "category" (Страница определённого вида работ со списком работ, имеющих отношение к этому виду).
     - "work" (Страница, демонтрирующая конретную выполненную работу).
     - "unknown" (Тип неопределённой страницы - возвращается, когда ни один вышеуказанный тип не подошёл).
   А также в перспективе:
     - "redirect" ???
-------------------------------------------------------------------------------
2016-05-03
1. В разделе 'experience' реализован редирект (см. файл 'experience/works-urls-http301.json').
В функции checkPageType() новый тип: 'redirect'.
Программы в файлах page-experience и pageRouter и server-dev обрабатывают 'redirect'.

2. Программы в файле 'page-experience.js' (функции getPage() и getPageCode()) работают не оптимально.
Собственно, нет никакого особого смысла вызывать getPageCode() - можно собирать все данные в единый пакет.

3. Сообщение "Нажмите клавишу [Esc], чтобы закрыть изображение" для плагина PrettyPhoto.
Был добавлен специальны <div> внутрь <div class="pp_pic_holder"> в файле 'static/scripts/jquery.prettyPhoto.js'.

4. Подпись к каждому изображению выполненной работы в рамках галереи PrettyPhoto теперь оформлена как гиперссыла.
В файле 'block-work-images.xml' в теге <a> в атрибуте 'title' встроена гиперссылка:

    <a href="" title="<a href='/experience/{images.urlpart}'>
        {images.title}
    </a>"
-------------------------------------------------------------------------------

ToDo:
1. Нужно реализовать отрисовку грамот в выполненных работах...
2. Раздел "Контакты".

-------------------------------------------------------------------------------
2016-05-09/2016-05-10

[заплатка]
Было принято решение в разделе 'services' вывести только корневые страницы + дочерние страницы
категории 'clean' (высотный клининг).
А чтобы корректно работали все ссылки из раздела 'experience' на некорневые (см. выше) страницы раздела 'service' было решено
все некорневые страницы адресовать на ближайшие корневые страницы + саму старницу передавать через "#" (хэш).

Для этого в программном коде 'pageGenerator/experience/getter-categories.js' были внесено несколько дополнительных функций "заплаток":
  - getPageUrlPartById_onlyRoot()
  - getRootUrlPartById()
  - checkId()

Функция getPageUrlPartById_onlyRoot() вызывается в программе 'pageGenerator/experience/page-experience.js'
вместо функции 'getPageUrlPartById(). См. обработчик страниц с выполнеными работами (getPage(): case "work": ...).
-------------------------------------------------------------------------------