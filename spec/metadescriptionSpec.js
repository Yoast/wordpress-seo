require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var metaArgs = {
    keyword: "keyword",
    queue: ["metaDescription"],
    meta: "this is the metadescription that contains a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
   it("returns a match for the keyword", function(){
       var metaAnalyzer = new YoastSEO_Analyzer(metaArgs);
       var result = metaAnalyzer.metaDescription();
       expect(result[0].result).toBe(51);
       expect(result[1].result).toBe(1);
   });
});

var metaArgs2 = {
    keyword: "sample",
    queue: ["metaDescription"],
    meta: "this is the metadescription that doesn't contains a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
    it("returns no matches for the keyword, since it isn't there", function(){
        var metaAnalyzer = new YoastSEO_Analyzer(metaArgs2);
        var result = metaAnalyzer.metaDescription();
        expect(result[0].result).toBe(59);
        expect(result[1].result).toBe(0);
    });
});

var metaArgs3 = {
    keyword: "sample",
    queue: ["metaDescription"]
};

describe("a test matching the keywords in the metadescription", function(){
    it("returns no matches for the keyword, since there is no metadescription", function(){
        var metaAnalyzer = new YoastSEO_Analyzer(metaArgs3);
        var result = metaAnalyzer.metaDescription();
        expect(result[0].result).toBe(0);
        expect(result[1].result).toBe(0);
    });
});