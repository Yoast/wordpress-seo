require("./helpers/i18n.js");
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var fleschArgs = {
    text: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    queue: ["fleschReading"]
};

describe("Test for the flesch kincaid reading", function(){
    it("returns a flesh kincaid reading score", function(){
        var flesch = Factory.buildAnalyzer(fleschArgs);
        var result = flesch.fleschReading();
		/*
		 48 words, 63 syllables, 3 sentences
		 206.835 - 1.015 (48 / 3) - 84.6 ( 63 / 3 ); = 79.6
		 */
        expect(result[0].result).toBe("79.6");
    });
});

var fleschArgs2 = {
    text: "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.",
    queue: ["fleschReading"]
};

describe("2nd test for the flesch kincaid reading", function(){
    it("returns a flesh kincaid reading score", function(){
        var flesch2 = Factory.buildAnalyzer(fleschArgs2);
        var result = flesch2.fleschReading();
        expect(result[0].result).toBe("63.9");
    });
});

var fleschArgs3 = {
	text: ""
};

describe("3rd test for the flesch kincaid reading", function(){
	it("returns nothing, since no text is defined", function(){
		var flesch3 = Factory.buildAnalyzer(fleschArgs3);
		var result = flesch3.fleschReading();
		expect(result[0].result).toBe(0);
	});
});