require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");

titleArg = {
    pageTitle: "this is a pagetitle",
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in the pagetitle", function(){
   it("returns the number of characters", function(){
       pagetitleAnalyzer = new Analyzer(titleArg);
       result = pagetitleAnalyzer.pageTitleCount();
       expect(result[0].result).toBe(19);
   });
});

titleArg2 = {
    pageTitle: "this is a much longer pagetitle",
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in the pagetitle", function(){
    it("returns the number of characters", function(){
        pagetitleAnalyzer = new Analyzer(titleArg2);
        result = pagetitleAnalyzer.pageTitleCount();
        expect(result[0].result).toBe(31);
    });
});


titleArg3 = {
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in an empty pagetitle", function(){
   it("returns null", function(){
      pagetitleAnalyzer = new Analyzer(titleArg3);
      result = pagetitleAnalyzer.pageTitleCount();
      expect(result[0].result).toBe(0);
   });
});