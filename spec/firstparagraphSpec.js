require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");
var firstParagraphArg = {
    text: "<p>this is a default text to test the first paragraph for the word keyword</p> if the keyword is mentioned after the first paragraph, it shouldn't count the keyword. ",
    queue: ["firstParagraph"],
    keyword: "keyword"
};

describe("a test for checking the first paragraph for keyword(s)", function() {
    it("returns the count of keywords", function() {
        firstParagraphAnalyzer = Factory.buildAnalyzer(firstParagraphArg);
        result = firstParagraphAnalyzer.firstParagraph();
        expect(result[0].result).toBe(1);
    });
});

var firstParagraphArg2 = {
    text: "this is a default text to test the first paragraph for the word keyword if the keyword is mentioned after the first paragraph, it shouldn't count the keyword. ",
    queue: ["firstParagraph"],
    keyword: "keyword"
};

describe("a test for checking the first paragraph for keywords, when no paragraph is defined", function(){
    it("returns 0, since no paragraphs are in text", function(){
        firstParagraphAnalyzer2 = Factory.buildAnalyzer(firstParagraphArg2);
        result = firstParagraphAnalyzer2.firstParagraph();
        expect(result[0].result).toBe(0);
    });
});

var firstParagraphArg3 =  {
    text: "<p>One question we get</p> quite often <p>in our website reviews</p> is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.",
    keyword: "website",
    queue: ["firstParagraph"]
};

describe("a test for checking the first paragraph for keywords, when no paragraph is defined", function(){
    it("returns 0, since there are 2 paragraphs and 2nd matches keyword", function(){
        firstParagraphAnalyzer3 = Factory.buildAnalyzer(firstParagraphArg3);
        result = firstParagraphAnalyzer3.firstParagraph();
        expect(result[0].result).toBe(0);
    });
});

var firstParagraphArg4 = {
    text: "One question we get quite often in our website reviews \n\n is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.",
    keyword: "website",
    queue: ["firstParagraph"]
};

describe("a test for checking the firstparagraph with newlines in stead of <p>-tags", function(){
    it("returns 1, the keyword is used before the double linebreak", function(){
        firstParagraphAnalyzer4 = Factory.buildAnalyzer(firstParagraphArg4);
        result = firstParagraphAnalyzer4.firstParagraph();
        expect(result[0].result).toBe(1);
    });
});
