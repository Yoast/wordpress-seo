require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var metaArgs = {
    keyword: "keyword",
    queue: ["metaDescriptionLength"],
    meta: "this is the metadescription that contains a keyword"
};

describe("a test returning the length of the metadescription", function(){
   it("returns a match for the keyword", function(){
       var metaAnalyzer = Factory.buildAnalyzer(metaArgs);
       var result = metaAnalyzer.metaDescriptionLength();
       expect(result[0].result).toBe(51);
   });
});

var metaArgs2 = {
    keyword: "sample",
    queue: ["metaDescriptionLength"],
    meta: "this is the metadescription that doesn't contains a keyword"
};

describe("a test returning the length of the metadescription", function(){
    it("returns no matches for the keyword, since it isn't there", function(){
        var metaAnalyzer = Factory.buildAnalyzer(metaArgs2);
        var result = metaAnalyzer.metaDescriptionLength();
        expect(result[0].result).toBe(59);
    });
});

var metaArgs3 = {
    keyword: "sample",
    queue: ["metaDescriptionLength"]
};

describe("a test returning the length of the metadescription", function(){
    it("returns 0 for the length, since there is no metadescription", function(){
        var metaAnalyzer = Factory.buildAnalyzer(metaArgs3);
        var result = metaAnalyzer.metaDescriptionLength();
        expect(result[0].result).toBe(0);
    });
});
