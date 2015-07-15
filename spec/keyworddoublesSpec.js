require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var doubleArgs = {
    text: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    keyword: "test",
    queue: ["keywordDoubles"]
};

describe("Test for the focus keyword doubles", function(){
    it("returns no double keywords", function(){
        var analyzer = new YoastSEO_Analyzer(doubleArgs);
        var result = analyzer.keywordDoubles();
        expect(result[0].result).toBe(0);
    });
});

var doubleArgs2 = {
    text: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    keyword: "yoast",
    queue: ["keywordDoubles"]
};

describe("Test for the focus keyword doubles", function(){
    it("returns a keyword double", function(){
        YoastSEO_config.usedKeywords = ["This","is","the","year","that","Yoast","turns","years","old"];
        var analyzer = new YoastSEO_Analyzer(doubleArgs2);
        var result = analyzer.keywordDoubles();
        expect(result[0].result).toBe(1);
    });
});

var doubleArgs3 = {
    text: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    keyword: "yoast",
    queue: ["keywordDoubles"]
};

describe("Test for the focus keyword doubles", function(){
    it("returns 3 keyword doubles", function(){
        YoastSEO_config.usedKeywords = ["yoast", "YoAsT", "Yoast"];
        var analyzer = new YoastSEO_Analyzer(doubleArgs3);
        var result = analyzer.keywordDoubles();
        expect(result[0].result).toBe(3);
    });
});