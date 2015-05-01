require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");

preprocArgs2 = {
    testString: "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite",
    testString2 : "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.",
    testString3 : "Bridger Pass is a mountain pass in Carbon County, Wyoming on the Continental Divide near the south Great Divide Basin bifurcation point, i.e., the point at which the divide appears to split and envelop the basin.",
    testString4 : "A test based on exclusionwords for syllablecount"
};

describe("Test for the syllablecount", function(){
    preproc2 = new PreProcessor(preprocArgs2.testString);
    it("returns syllable count of first string", function(){
        expect(preproc2.__store.syllablecount).toBe(62);
    });
    preproc3 = new PreProcessor(preprocArgs2.testString2);
    it("returns syllable count of 2nd string", function(){
        expect(preproc3.__store.syllablecount).toBe(65);
    });
    preproc4 = new PreProcessor(preprocArgs2.testString3);
    it("returns syllable count of 3rd string", function(){
        expect(preproc4.__store.syllablecount).toBe(57);
    });
    preproc5 = new PreProcessor(preprocArgs2.testString4);
    preprocessorConfig.syllables.exclusionWords.push({word: "exclusionwords", syllables: 5});
    preprocessorConfig.syllables.exclusionWords.push({word: "syllablecount", syllables: 4});
    it("returns syllable count of 4th string by using exclusionwords", function(){
        expect(preproc5.__store.syllablecount).toBe(14);
    });
});
