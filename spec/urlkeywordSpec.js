require("../js/config/config.js");
require("../js/analyzer.js");

var urlArgs = {
    keyword: "keyword",
    queue: ["urlKeyword"],
    url: "https://yoast.com/keyword-yoast"
};

describe("a test matching the keywords in the url", function(){
    it("returns a match for the keyword", function(){
        var urlAnalyzer = new Analyzer(urlArgs);
        var result = urlAnalyzer.urlKeyword();
        expect(result.result.count).toBe(1);
    });
});

var urlArgs2 = {
    keyword: "sample",
    queue: ["urlKeyword"],
    url: "https://yoast.com/keyword-yoast"
};

describe("a test matching the keywords in the url", function(){
    it("returns no matches for the keyword, since it isn't there", function(){
        var urlAnalyzer = new Analyzer(urlArgs2);
        var result = urlAnalyzer.urlKeyword();
        expect(result.result.count).toBe(0);
    });
});

var urlArgs3 = {
    keyword: "sample",
    queue: ["urlKeyword"]
};

describe("a test matching the keywords in the url", function(){
    it("returns no matches for the keyword, since there is no url defined", function(){
        var urlAnalyzer = new Analyzer(urlArgs3);
        var result = urlAnalyzer.urlKeyword();
        expect(result.result.count).toBe(0);
    });
});