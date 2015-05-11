require("../js/config/config.js");
require("../js/analyzer.js");

var firstParagraphArg = {
    textString: "<p>this is a default text to test the first paragraph for the word keyword</p> if the keyword is mentioned after the first paragraph, it shouldn't count the keyword. ",
    queue: ["firstParagraph"],
    keyword: "keyword"
};

describe("a test for checking the first paragraph for keyword(s)", function() {
    it("returns the count of keywords", function() {
        firstParagraphAnalyzer = new Analyzer(firstParagraphArg);
        result = firstParagraphAnalyzer.firstParagraph();
        expect(result.count).toBe(1);
    });
});

var firstParagraphArg2 = {
    textString: "this is a default text to test the first paragraph for the word keyword if the keyword is mentioned after the first paragraph, it shouldn't count the keyword. ",
    queue: ["firstParagraph"],
    keyword: "keyword"
};

describe("a test for checking the first paragraph for keywords, when no paragraph is defined", function(){
    it("returns 0, since no paragraphs are in textString", function(){
        firstParagraphAnalyzer2 = new Analyzer(firstParagraphArg2);
        result = firstParagraphAnalyzer2.firstParagraph();
        expect(result.count).toBe(0);
    });
});

var firstParagraphArg3 =  {
    textString: "<p>One question we get</p> quite often <p>in our website reviews</p> is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.",
    keyword: "website",
    queue: ["firstParagraph"]
};

describe("a test for checking the first paragraph for keywords, when no paragraph is defined", function(){
    it("returns 0, since there are 2 paragraphs and 2nd matches keyword", function(){
        firstParagraphAnalyzer3 = new Analyzer(firstParagraphArg3);
        result = firstParagraphAnalyzer2.firstParagraph();
        expect(result.count).toBe(0);
    });
});
