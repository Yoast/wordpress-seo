require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

keywordArgs = {
    text: "Last month, Google actually announced a change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search Traffic section, but they also sent out emails with the subject Fix mobile usability issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "mobile",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a good amount of occurences of the keyword ", function(){
    it("returns keyword density - good", function(){
        var textAnalyzerDensity = Factory.buildAnalyzer(keywordArgs);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result[0].result).toContain(1.6);
    });
});

keywordArgs2 = {
    text: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "mobile",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a high-density occurence of the keyword", function(){
    it("returns keyword density - high", function(){
        var textAnalyzerDensity = Factory.buildAnalyzer(keywordArgs2);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result[0].result).toContain(5.5);
    });
});

keywordArgs3 = {
    text: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "potato",
    queue: ["keywordDensity"]
};

describe("A keyword density test where there are no matching keywords", function(){
    it("returns keyword density - none ", function(){
        var textAnalyzerDensity = Factory.buildAnalyzer(keywordArgs3);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result[0].result).toContain(0);
    });
});

keywordArgs4 = {
    text: "Last month, Google mobile actually announced a mobile change in their ",
    keyword: "potato",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a string shorter than 100 words", function(){
    it("returns keyword density - < 100", function(){
        var textAnalyzer = Factory.buildAnalyzer(keywordArgs4);
        var result = textAnalyzer.keywordDensity();
        expect(result).toBe(undefined);
    });
});

keywordArgs5 = {
    text: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "month",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a low occurence of the keyword", function(){
    it("returns keyword density - low ", function(){
        var textAnalyzer = Factory.buildAnalyzer(keywordArgs5);
        textAnalyzer.runQueue();

    });
});

keywordArgs6 = {
	text: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
	keyword: "<i>mobile</i>",
	queue: ["keywordDensity"]
};

describe("A keyword density test with a high-density occurence of the keyword, where the keyword has htmltags.", function(){
	it("returns keyword density - high", function(){
		var textAnalyzerDensity = Factory.buildAnalyzer(keywordArgs6);
		var result = textAnalyzerDensity.keywordDensity();
		expect(result[0].result).toContain(5.5);
	});
});

keywordArgs7 = {
    text: "focus&nbsp;keyword a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a" +
    " a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a",
    keyword: "focus keyword",
    queue: ["keywordDensity"]
};

describe("A keyword density test with &nbsp;", function(){
    it("it should match &nbsp; with an actual space", function(){
        var analyzer = Factory.buildAnalyzer(keywordArgs7);
        var result = analyzer.keywordDensity();

        expect(result[0].result).toContain(1.0);
    });
});

keywordArgs8 = {
	text: "Тест текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто testText проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Тест текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто testText проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто Test текст, чтобы проверить нечто",
	keyword: "нечто"
};

describe("A keyword density test with Arabic language", function(){
	it("should match keyword in the text", function(){
		var analyzer = Factory.buildAnalyzer(keywordArgs8);
		var result = analyzer.keywordDensity();

		expect(result[0].result).toContain(20.7);
	});
});

keywordArgs9 = {
	text: "Key'word ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non turpis mattis mi malesuada commodo sed sed ipsum. Curabitur nec mi dui. Sed sit amet eros rhoncus, fringilla nulla eget, fermentum nisi. Praesent lacinia purus ac lacus consectetur tincidunt id auctor enim. Quisque nec odio scelerisque, viverra ipsum nec, molestie mauris. Aliquam sed ultricies lorem, sit amet dictum diam. Fusce vel ullamcorper felis, eget accumsan erat. Quisque eu mattis magna, vel sodales nulla. Phasellus iaculis leo non sapien auctor commodo. Aliquam tincidunt, nisl eget scelerisque luctus, ex ipsum diam scelerisque felis, vitae commodo justo arcu vitae sem. Proin maximus odio sed.",
	keyword: "Key'word"
};

describe("A text matching the keyword when it has an ' in it", function(){
	it("should match keyword in the text", function(){
		var analyzer = Factory.buildAnalyzer(keywordArgs9);
		var result = analyzer.keywordDensity();

		expect(result[0].result).toContain(1.0);
	});
});