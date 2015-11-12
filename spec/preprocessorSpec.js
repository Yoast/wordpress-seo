require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

preprocArgs = {
    testString: "<h1>Dit is een</h1> <h2>standaard</h2>- TEKST <ul><li>test1</li><li>test2</li><li>test3</li><li>test4</li></ul>met VEEL caps, spaties, <h6>tekens</h6> en andere overbodige meuk!?'...; <img src='http://linknaarplaatje' alt='mooiplaatje' />Het aantal Woorden<br><br> is negentien"
};

expectedOutput = {
    cleanText: "<h1>dit is een</h1> <h2>standaard</h2> tekst <ul><li>test1</li><li>test2</li><li>test3</li><li>test4</li></ul>met veel caps spaties <h6>tekens</h6> en andere overbodige meuk. <img src= http //linknaarplaatje alt= mooiplaatje />het aantal woorden<br><br> is negentien.",
    cleanTextSomeTags: "<h1>dit is een</h1> <h2>standaard</h2> tekst <li>test1</li><li>test2</li><li>test3</li><li>test4</li> met veel caps spaties <h6>tekens</h6> en andere overbodige meuk. het aantal woorden is negentien.",
    cleanTextNoTags: "dit is een standaard tekst test1 test2 test3 test4 met veel caps spaties tekens en andere overbodige meuk. het aantal woorden is negentien."
};

describe("Test for the preprocessor that formats text for the analyzer", function(){
    preproc = new YoastSEO.PreProcessor(preprocArgs.testString);
    it("returns processed clean text", function(){
        expect(preproc.__store.cleanText).toBe(expectedOutput.cleanText);
    });
    it("returns processed notags text", function(){
        expect(preproc.__store.cleanTextNoTags).toBe(expectedOutput.cleanTextNoTags);
    });
    it("returns processed sometags text", function(){
        expect(preproc.__store.cleanTextSomeTags).toBe(expectedOutput.cleanTextSomeTags);
    });
});

//Test for wordcount if sentence ends with a tag.
it("return 1 word if there is one word", function() {
	preProcessor = new YoastSEO.PreProcessor('<p>word</p>');

	expect(preProcessor.__store.wordcountNoTags ).toBe(1);
});

//Test for wordcount if sentence has lots of spaces
it("return 1 word if there is one word, despite spaces", function() {
	preProcessor = new YoastSEO.PreProcessor('word               .');

	expect(preProcessor.__store.wordcountNoTags ).toBe(1);
});
