require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");

scoreArgs = {
    textString: "<p>One of the speakers at our upcoming <a href='https://yoast.com/conference/'>YoastCon</a> is Marcus Tandler, one of my best friends in the industry. I met Marcus&nbsp;almost at the beginning of my career as an&nbsp;SEO consultant, we’ve since&nbsp;had fun at numerous conferences throughout the world, most notably <a href='http://seoktoberfest.net/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://seoktoberfest.net/', 'SEOktoberfest');'>SEOktoberfest</a>, which Marcus organizes in his hometown Munich.</p><p>I’m very proud that he’ll be speaking at YoastCon and wanted to show you all, as a warmup, this presentation he gave at TedX Munich, about the (past, present &amp;) future of search:</p><p>At YoastCon, Marcus will <a href='https://yoast.com/conference/program/#marcus-tandler'>talk about the “rise of the machines”</a>: the next big step in search engine ranking. He will explain how Google is now using machine learning and why he thinks links, currently a major factor of the ranking process, will soon become irrelevant.</p>",
    keyword: "search",
    url: "http://yoast.com/keyword-search",
    pageTitle: "the pagetitle",
    meta: "the metadescription of the page",
    queue: ["wordCount","keywordDensity","fleschReading","firstParagraph"]
};

describe("a test for the scoring function of all functions in the analyzer", function(){
   it("returns scores for all objects", function(){
       var scorer = new Analyzer(scoreArgs);
       scorer.runQueue();
       var analyzeScore = yst_analyzeScorer.__score;
       expect(analyzeScore.length).toBe(4);
       expect(analyzeScore[0].name).toBe("wordCount");
       expect(analyzeScore[0].score).toBe(-20);
       expect(analyzeScore[1].name).toBe("keywordDensity");
       expect(analyzeScore[1].score).toBe(9);
       expect(analyzeScore[1].text).toBe("The keyword density is 1.3%, which is great, the keyword was found 2 times.");
       expect(analyzeScore[2].name).toBe("fleschReading");
       expect(analyzeScore[2].score).toBe(5);
       expect(analyzeScore[2].text).toBe("The copy scores 49.0 in the <a href='http://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease'>Flesch Reading Ease</a> test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability.")
       expect(analyzeScore[3].name).toBe("firstParagraph");
       expect(analyzeScore[3].score).toBe(9);



   });
});