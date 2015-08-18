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

	},{
		text:"Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit. Sed key word dictum malesuada tellus vitae ultrices. Sed iaculis faucibus nunc, sit amet condimentum libero elementum ut. Ut interdum mi in velit vulputate, a feugiat sem aliquet. Proin key-word non quam convallis mauris pretium vulputate. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vel eros quis velit posuere euismod. Donec facilisis venenatis justo a dignissim. Nunc commodo nisl ante. Suspendisse fermentum arcu quis finibus suscipit. In consectetur vestibulum ligula. Maecenas tristique aliquet diam, nec luctus dolor viverra non. Proin luctus nisl nec ipsum congue, id aliquam mi lobortis. Donec vel consequat ex. In euismod lectus ex, at congue ante suscipit id. Cras posuere, mauris vel ultricies blandit, urna lectus eleifend ante, eget venenatis dolor massa et lorem. Mauris lacinia faucibus nulla, nec congue orci molestie eget. Maecenas ac tristique arcu, eu iaculis arcu. Nunc sollicitudin blandit est, ultricies congue eros semper sit amet. Praesent non scelerisque est. Donec tristique sollicitudin enim, sit amet semper tortor posuere vitae. Quisque eget imperdiet ligula. Nullam tincidunt eleifend sodales.",
		pageTitle: "pageTitle",
		keyword: "key-word",
		url: "url",
		meta: "",
		queue: ["keywordDensity"]
	},{
		text:"Lorem ipsum dolor sit amet, <keyword» consectetur <keyword» adipiscing elit. Sed <keyword» dictum malesuada tellus vitae ultrices. Sed iaculis faucibus nunc, sit amet condimentum libero elementum ut. Ut interdum mi in velit vulputate, a feugiat sem aliquet. Proin <keyword» non quam convallis mauris pretium vulputate. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vel eros quis velit posuere euismod. Donec facilisis venenatis justo a dignissim. Nunc commodo nisl ante. Suspendisse fermentum arcu quis finibus suscipit. In consectetur vestibulum ligula. Maecenas tristique aliquet diam, nec luctus dolor viverra non. Proin luctus nisl nec ipsum congue, id aliquam mi lobortis. Donec vel consequat ex. In euismod lectus ex, at congue ante suscipit id. Cras posuere, mauris vel ultricies blandit, urna lectus eleifend ante, eget venenatis dolor massa et lorem. Mauris lacinia faucibus nulla, nec congue orci molestie eget. Maecenas ac tristique arcu, eu iaculis arcu. Nunc sollicitudin blandit est, ultricies congue eros semper sit amet. Praesent non scelerisque est. Donec tristique sollicitudin enim, sit amet semper tortor posuere vitae. Quisque eget imperdiet ligula. Nullam tincidunt eleifend sodales.",
		pageTitle: "pageTitle",
		keyword: "<keyword»",
		url: "url",
		meta: "",
		queue: ["keywordDensity"]
	},{
		text:"<table><tr><td><p>Lorem ipsum dolor sit amet, keyword consectetur keyword adipiscing elit. </p></td></tr></table>Sed keyword dictum malesuada tellus vitae ultrices. Sed iaculis faucibus nunc, sit amet condimentum libero elementum ut. Ut interdum mi in velit vulputate, a feugiat sem aliquet. Proin keyword non quam convallis mauris pretium vulputate. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vel eros quis velit posuere euismod. Donec facilisis venenatis justo a dignissim. Nunc commodo nisl ante. Suspendisse fermentum arcu quis finibus suscipit. In consectetur vestibulum ligula. Maecenas tristique aliquet diam, nec luctus dolor viverra non. Proin luctus nisl nec ipsum congue, id aliquam mi lobortis. Donec vel consequat ex. In euismod lectus ex, at congue ante suscipit id. Cras posuere, mauris vel ultricies blandit, urna lectus eleifend ante, eget venenatis dolor massa et lorem. Mauris lacinia faucibus nulla, nec congue orci molestie eget. Maecenas ac tristique arcu, eu iaculis arcu. Nunc sollicitudin blandit est, ultricies congue eros semper sit amet. Praesent non scelerisque est. Donec tristique sollicitudin enim, sit amet semper tortor posuere vitae. Quisque eget imperdiet ligula. Nullam tincidunt eleifend sodales.",
		pageTitle: "pageTitle",
		keyword: "keyword",
		url: "url",
		meta: "",
		queue: ["firstParagraph"]
	},{
		text:"<p class='className' style='float:left'>Lorem ipsum dolor sit amet, keyword consectetur keyword adipiscing elit. </p>Sed keyword dictum malesuada tellus vitae ultrices. Sed iaculis faucibus nunc, sit amet condimentum libero elementum ut. Ut interdum mi in velit vulputate, a feugiat sem aliquet. Proin keyword non quam convallis mauris pretium vulputate. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vel eros quis velit posuere euismod. Donec facilisis venenatis justo a dignissim. Nunc commodo nisl ante. Suspendisse fermentum arcu quis finibus suscipit. In consectetur vestibulum ligula. Maecenas tristique aliquet diam, nec luctus dolor viverra non. Proin luctus nisl nec ipsum congue, id aliquam mi lobortis. Donec vel consequat ex. In euismod lectus ex, at congue ante suscipit id. Cras posuere, mauris vel ultricies blandit, urna lectus eleifend ante, eget venenatis dolor massa et lorem. Mauris lacinia faucibus nulla, nec congue orci molestie eget. Maecenas ac tristique arcu, eu iaculis arcu. Nunc sollicitudin blandit est, ultricies congue eros semper sit amet. Praesent non scelerisque est. Donec tristique sollicitudin enim, sit amet semper tortor posuere vitae. Quisque eget imperdiet ligula. Nullam tincidunt eleifend sodales.",
		pageTitle: "pageTitle",
		keyword: "keyword",
		url: "url",
		meta: "",
		queue: ["firstParagraph"]
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

	it("checks for keywords with hyphens - should return 4 matches = keywordDensity = 2.2", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[3] );
		var result = keywordAnalyzer.keywordDensity();
		expect(result[0].result).toBe("2.2");
	});

	it("checks for keywords with special chars - should return 4 matches = keywordDensity = 2.2", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[4] );
		var result = keywordAnalyzer.keywordDensity();
		expect(result[0].result).toBe("2.2");
	});

	it("checks for keywords with tables - keyword should be found in first paragraph", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[5] );
		var result = keywordAnalyzer.firstParagraph();
		expect(result[0].result).toBe(1);
	});

	it("checks for keywords with attr on <p> - keyword should be found in first paragraph", function(){
		var keywordAnalyzer = Factory.buildAnalyzer( textStrings[6] );
		var result = keywordAnalyzer.firstParagraph();
		expect(result[0].result).toBe(1);
	});
});

