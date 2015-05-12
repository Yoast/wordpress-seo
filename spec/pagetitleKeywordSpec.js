require("../js/config/config.js");
require("../js/analyzer.js");
require("../js/config/scoring.js");

titleKeywordArg = {
    pageTitle: "this is a pagetitle",
    keyword: "pagetitle",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns the number of keywordmatches", function(){
        var pagetitleKeyword = new Analyzer(titleKeywordArg);
        result = pagetitleKeyword.pageTitleKeyword();
        expect(result[0].result).toBe(1);
    });
});

titleKeywordArg2 = {
    pageTitle: "this is a much longer pagetitle",
    keyword: "keyword",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns zero, since there is no keyword match", function(){
        var pagetitleAnalyzer2 = new Analyzer(titleKeywordArg2);
        result = pagetitleAnalyzer2.pageTitleKeyword();
        expect(result[0].result).toBe(0);
    });
});

titleKeywordArg3 = {
    textString: "this is a default text",
    keyword: "keyword",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns zero, since there is no pagetitle", function(){
        var pagetitleAnalyzer3 = new Analyzer(titleKeywordArg3);
        result = pagetitleAnalyzer3.pageTitleKeyword();
        expect(result[0].result).toBe(0);
    });
});