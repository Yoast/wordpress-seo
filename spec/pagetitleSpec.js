require("./helpers/i18n.js");
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

titleArg = {
    pageTitle: "this is a pagetitle",
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in the pagetitle", function(){
   it("returns the number of characters", function(){
       pagetitleAnalyzer = Factory.buildAnalyzer(titleArg);
       result = pagetitleAnalyzer.pageTitleLength();
       expect(result[0].result).toBe(19);
   });
});

titleArg2 = {
    pageTitle: "this is a much longer pagetitle",
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in the pagetitle", function(){
    it("returns the number of characters", function(){
        pagetitleAnalyzer = Factory.buildAnalyzer(titleArg2);
        result = pagetitleAnalyzer.pageTitleLength();
        expect(result[0].result).toBe(31);
    });
});


titleArg3 = {
    queue: ["pagetitle"]
};

describe("a test counting the number of characters in an empty pagetitle", function(){
   it("returns null", function(){
      pagetitleAnalyzer = Factory.buildAnalyzer(titleArg3);
      result = pagetitleAnalyzer.pageTitleLength();
      expect(result[0].result).toBe(0);
   });
});
