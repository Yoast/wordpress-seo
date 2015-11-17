require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

titleKeywordArg = {
    pageTitle: "this is a pagetitle",
    keyword: "pagetitle",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns the number of keywordmatches", function(){
        var pagetitleKeyword = Factory.buildAnalyzer(titleKeywordArg);
        result = pagetitleKeyword.pageTitleKeyword();
        expect(result[0].result.matches).toBe(1);
        expect(result[0].result.position).toBe(10);
    });
});

titleKeywordArg2 = {
    pageTitle: "this is a much longer pagetitle",
    keyword: "keyword",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns zero, since there is no keyword match", function(){
        var pagetitleAnalyzer2 = Factory.buildAnalyzer(titleKeywordArg2);
        result = pagetitleAnalyzer2.pageTitleKeyword();
        expect(result[0].result.matches).toBe(0);
    });
});

titleKeywordArg3 = {
    textString: "this is a default text",
    keyword: "keyword",
    queue: ["pageTitleKeyword"]
};

describe("a test to check if the keyword occurs in the pagetitle", function(){
    it("returns zero, since there is no pagetitle", function(){
        var pagetitleAnalyzer3 = Factory.buildAnalyzer(titleKeywordArg3);
        result = pagetitleAnalyzer3.pageTitleKeyword();
        expect(result[0].result.matches).toBe(0);
    });
});

titleKeywordArg4 = {
    pageTitle: "focus keyword",
    keyword: "focus keyword",
    queue: ["pageTitleKeyword"]
};
titleKeywordArg5 = {
    pageTitle: "focus-keyword",
    keyword: "focus-keyword",
    queue: ["pageTitleKeyword"]
};
titleKeywordArg6 = {
    pageTitle: "focus-keyword",
    keyword: "focus keyword",
    queue: ["pageTitleKeyword"]
};
titleKeywordArg7 = {
    pageTitle: "focus keyword",
    keyword: "focus-keyword",
    queue: ["pageTitleKeyword"]
};
titleKeywordArg8 = {
	pageTitle: "Focus keyword",
	keyword: "focus keyword",
	queue: ["pageTitleKeyword"]
};
titleKeywordArg9 = {
	pageTitle: "äbc",
	keyword: "äbc"
};

describe("a test with keywords", function() {
	var pageTitleAnalyzer;
	var result;

	it("returns correct results with spaces in the keyword", function() {
		pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg4);

		result = pageTitleAnalyzer.pageTitleKeyword();

		expect(result[0 ].result.matches ).toBe(1);
		expect(result[0 ].result.position ).toBe(0);
	});

	it("returns correct results with a dash in the keyword", function() {
		pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg5);

		result = pageTitleAnalyzer.pageTitleKeyword();

		expect(result[0 ].result.matches ).toBe(1);
		expect(result[0 ].result.position ).toBe(0);
	});

    it("returns correct results with a dash in the keyword", function() {
        pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg6);

        result = pageTitleAnalyzer.pageTitleKeyword();

        expect(result[0 ].result.matches ).toBe(0);
        expect(result[0 ].result.position ).toBe(-1);
    });

    it("returns correct results with a dash in the keyword", function() {
        pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg7);

        result = pageTitleAnalyzer.pageTitleKeyword();

        expect(result[0 ].result.matches ).toBe(0);
        expect(result[0 ].result.position ).toBe(-1);
    });
	it("returns correct results with a capital in the keyword", function() {
		pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg8);

		result = pageTitleAnalyzer.pageTitleKeyword();

		expect(result[ 0].result.matches).toBe(1);
		expect(result[0 ].result.position ).toBe(0);
	});
	it("returns correct results with a diacritic in the keyword", function() {
		pageTitleAnalyzer = Factory.buildAnalyzer(titleKeywordArg9);

		result = pageTitleAnalyzer.pageTitleKeyword();

		expect(result[ 0].result.matches).toBe(1);
		expect(result[0 ].result.position ).toBe(0);
	});
});


