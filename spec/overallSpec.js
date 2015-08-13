/**
 * spec to be used to test all old issues
 */
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");


var textStrings = [
	{
		text:"	עיסוקו העיקרי של משרדה של עורך דין שלי גרשט הינו בהליכי הוצאה לפועל, ייצוג	חייבים, פשיטות רגל וגבייה.		עורכת דין שלי גרשט הינה עורכת דין בהוצאה לפועל בעלת ניסיון רב , יחס אישי	ומקצועיות ועל כן מייצגת חייבים בתיקי הוצאה לפועל, זוכים בתיקי הוצאה	לפועל והוצאה	לפועל מזונות.		המשרד עוסק בייצוג מול מערכת ההוצאה לפועל, תוך גישה ישירה למערכת התיקים בהוצאה	  	עיסוקו העיקרי של משרדה של עורך דין שלי גרשט הינו בהליכי הוצאה לפועל, ייצוג	חייבים, פשיטות רגל וגבייה.		עורכת דין שלי גרשט הינה עורכת דין בהוצאה לפועל בעלת ניסיון רב , יחס אישי	ומקצועיות ועל כן מייצגת חייבים בתיקי הוצאה לפועל, זוכים בתיקי הוצאה	לפועל והוצאה	לפועל מזונות.		המשרד עוסק בייצוג מול מערכת ההוצאה לפועל, תוך גישה ישירה למערכת התיקים בהוצאה	  ",
		pageTitle: "pageTitle",
		keyword: "הוצאה לפועל",
		url: "url",
		meta: "no meta",
		queue: ["keywordDensity"]
	},
	{
		text: "Аз искам да кажа, че този плъгин е велик. Не разбирам много, но според мен на 1 място. Това е тестов текст за да видите дали при вас има този проблем, който потвърдихте, че е проблем. При мен е от над 1 година. Чудя се обаче защо чак сега намерих време и време да се свържа с вас. Успехи.	Отивам да работя. И прилагам превод на текста ми през гугъл преводача, чрез	който комуникирам с вас Аз искам да кажа, че този плъгин е велик. Не разбирам много, но според мен на 1 място. Това е тестов текст за да видите дали при вас има този проблем, който потвърдихте, че е проблем. При мен е от над 1 година. Чудя се обаче защо чак сега намерих време и време да се свържа с вас. Успехи.	Отивам да работя. И прилагам превод на текста ми през гугъл преводача, чрез	който комуникирам с вас",
		pageTitle: "",
		keyword: "вас",
		url: "url",
		meta: "no meta",
		queue: ["keywordDensity"]
	},{
		text: "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. Rubberneckin, äöüß oompaloomp yodel haus sie meister cuckoo weiner. Oof hinder morgen rubberneckin gewerkin sie makin wearin keepin stein gewerkin, in unter bar. Leiderhosen floppern, frau corkin verboten makin, äöüß hinder dummkopf poppin frankfurter unter, rubberneckin corkin, mitz flippin. Heiden ya ya wunderbar, hans flippin, pukein oof an weiner an. Bin deutsch mitten sie dorkin flippin auf noodle nine verboten spitzen underbite die. 	Oompaloomp ya stoppern mitz, morgen waltz makin gewerkin, weiner, weiner heiden, kaboodle keepin. Corkin underbite octoberfest spitzen das pretzel sie leiderhosen sie, haus, nine. Wearin handercloppen er gewerkin ist poppin mitz, haben hast. Dummkopf makin der stein spritz floppern sie spitzen cuckoo ya blimp ist pretzel ist auf. Wearin floppern ich achtung frau wunderbar frau mitz kaboodle auf nutske oof gewerkin floppern, gestalt. Haus octoberfest poken weiner frankfurter in. Hans blimp, makin bin der, auf ya makin. Ya sparkin sauerkraut hans sightseerin lookinpeepers hinder meister, stoppern. ",
		pageTitle: "",
		keyword: "äöüß",
		meta: "no meta",
		queue: ["keywordDensity"]

	}
];

describe("a test running multiple textstrings", function(){
	it("checks for keywords in hebrew - should return 8 matches - keywordDensity = 7.1", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[0] );
		var result = keywordAnalyzer.keywordDensity();
		expect(result[0].result).toBe("7.1");
	});

	it("checks for keywords in Cyrillic - should return 6 matches - keywordDensity = 4.1", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[1] );
		var result = keywordAnalyzer.keywordDensity();
		expect(result[0].result).toBe("4.1");
	});

	it("checks for keywords in German - should return 3 matches = keywordDensity = 1.9", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[2] );
		var result = keywordAnalyzer.keywordDensity();
		expect(result[0].result).toBe("1.9");
	});
});

