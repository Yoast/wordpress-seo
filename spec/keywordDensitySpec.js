require("../js/config/config.js");
require("../js/analyzer.js");

keywordArgs = {
    textString: "Last month, Google actually announced a change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search Traffic section, but they also sent out emails with the subject Fix mobile usability issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "mobile",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a good amount of occurences of the keyword ", function(){
    it("returns keyword density - good", function(){
        var textAnalyzerDensity = new Analyzer(keywordArgs);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result.result.keywordDensity).toContain(3.2);
    });
});

keywordArgs2 = {
    textString: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "mobile",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a high-density occurence of the keyword", function(){
    it("returns keyword density - high", function(){
        var textAnalyzerDensity = new Analyzer(keywordArgs2);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result.result.keywordDensity).toContain(6.9);
    });
});

keywordArgs3 = {
    textString: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "potato",
    queue: ["keywordDensity"]
};

describe("A keyword density test where there are no matching keywords", function(){
    it("returns keyword density - none ", function(){
        var textAnalyzerDensity = new Analyzer(keywordArgs3);
        var result = textAnalyzerDensity.keywordDensity();
        expect(result.result.keywordDensity).toContain(0);
    });
});

keywordArgs4 = {
    textString: "Last month, Google mobile actually announced a mobile change in their ",
    keyword: "potato",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a string shorter than 100 words", function(){
    it("returns keyword density - < 100", function(){
        var textAnalyzer = new Analyzer(keywordArgs4);
        var result = textAnalyzer.keywordDensity();
        expect(result.result.keywordDensity).toBe(0);
    });
});

keywordArgs5 = {
    textString: "Last month, Google mobile actually announced a mobile change in their algorithm before it had already happened. In this post they mention that starting April 21st mobile-friendliness will become a ranking factor more and more.    In the past few weeks we’ve been getting quite a few reports from Google Webmaster Tools. Not only did they add a Mobile Usability item under the Search mobile Traffic section, but they also sent out mobile emails with the subject Fix mobile usability mobile issues found on <website>. Obviously, Google is bringing mobile-friendliness under the website owner’s attention.    So we thought it would be a good idea to explain what you should pay attention to and what we think you should be doing to prepare yourself for the update on April 21st.",
    keyword: "month",
    queue: ["keywordDensity"]
};

describe("A keyword density test with a low occurence of the keyword", function(){
    it("returns keyword density - low ", function(){
        var textAnalyzer = new Analyzer(keywordArgs5);
        textAnalyzer.runQueue();

    });
});
