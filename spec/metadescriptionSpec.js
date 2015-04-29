require("../js/config/config.js");
require("../js/analyzer.js");

var metaArgs = {
    keyword: "keyword",
    queue: ["metaDescription"],
    meta: "this is the metadescription that contains a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
   it("returns a match for the keyword", function(){
       var metaAnalyzer = new Analyzer(metaArgs);
       var result = metaAnalyzer.metaDescription();
       expect(result.count).toBe(1);
       expect(result.length).toBe(51);
   });
});

var metaArgs2 = {
    keyword: "sample",
    queue: ["metaDescription"],
    meta: "this is the metadescription that doesn't contains a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
    it("returns no matches for the keyword, since it isn't there", function(){
        var metaAnalyzer = new Analyzer(metaArgs2);
        var result = metaAnalyzer.metaDescription();
        expect(result.count).toBe(0);
        expect(result.length).toBe(59);
    });
});

var metaArgs3 = {
    keyword: "sample",
    queue: ["metaDescription"]
};

describe("a test matching the keywords in the metadescription", function(){
    it("returns no matches for the keyword, since there is no metadescription", function(){
        var metaAnalyzer = new Analyzer(metaArgs3);
        var result = metaAnalyzer.metaDescription();
        expect(result.count).toBe(0);
        expect(result.length).toBe(0);
    });
});