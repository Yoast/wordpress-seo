require("../js/analyzer.js");

args = {
    keyword: "snippet",
    meta: "this is a test for the snippet preview",
    url: "https://yoast.com/research/snippet-preview/",
    pageTitle: "snippet preview by Yoast",
    text: "this is a text that is used if no meta description is given"
};

describe("a test for creating the output for the snippet preview", function() {
    var snippet = new SnippetPreview( args );
    var output = snippet.output;
    it("returns the output from the snippet preview", function(){
        expect(output.title).toContain("<strong>snippet</strong>");
        expect(output.cite).toContain("https://yoast.com/research/");
        expect(output.meta).toContain("this is a test for the <strong>snippet</strong> preview");
    });

});
