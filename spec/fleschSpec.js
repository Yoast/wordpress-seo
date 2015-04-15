require('../js/config/config.js');
require('../js/analyzer.js');


fleschArgs = {
    textString: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    keyword: "Yoast",
    queue: ["fleschReading"]
};

describe("Test for the flesch kincaid reading", function(){

    it("returns a flesh kincaid reading score", function(){
        flesch = new Analyzer(fleschArgs);
        expect(flesch.fleschReading()).toBe('83.309');
    });

});
