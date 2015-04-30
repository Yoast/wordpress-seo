require("../js/config/config.js");
require("../js/analyzer.js");

scoreArgs = {

};

describe("a test for the scoring function of all functions in the analyzer", function(){
   it("returns scores for all objects", function(){
       var scoreAnalyzer = new Analyzer(scoreArgs);
       var result = scoreAnalyzer.__output;
       expect(result.length).toBe(11);
   });
});