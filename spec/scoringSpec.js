require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");

scoreArgs = {
    textString: "<p>One of the speakers at our upcoming <a href='https://yoast.com/conference/'>YoastCon</a> is Marcus Tandler, one of my best friends in the industry. I met Marcus&nbsp;almost at the beginning of my career as an&nbsp;SEO consultant, we’ve since&nbsp;had fun at numerous conferences throughout the world, most notably <a href='http://seoktoberfest.net/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://seoktoberfest.net/', 'SEOktoberfest');'>SEOktoberfest</a>, which Marcus organizes in his hometown Munich.</p><p>I’m very proud that he’ll be speaking at YoastCon and wanted to show you all, as a warmup, this presentation he gave at TedX Munich, about the (past, present &amp;) future of search:</p><p>At YoastCon, Marcus will <a href='https://yoast.com/conference/program/#marcus-tandler'>talk about the “rise of the machines”</a>: the next big step in search engine ranking. He will explain how Google is now using machine learning and why he thinks links, currently a major factor of the ranking process, will soon become irrelevant.</p>",
    keyword: "about",
    url: "https://yoast.com/keyword-search",
    pageTitle: "the pagetitle",
    meta: "the metadescription of the page",
    queue: ["wordCount","keywordDensity","fleschReading","firstParagraph","metaDescription","stopwords","subHeadings","pageTitleLength","pageTitleKeyword","urlKeyword","urlLength","urlStopwords","imageCount","linkCount"]
};

describe("a test for the scoring function of all functions in the analyzer", function(){
   it("returns scores for all objects", function(){
       var scorer = new Analyzer(scoreArgs);
       scorer.runQueue();
       var analyzeScore = scorer.analyzeScorer.__score;
       expect(analyzeScore.length).toBe(15);
       expect(analyzeScore[0].name).toBe("wordCount");
       expect(analyzeScore[0].score).toBe(-20);
       expect(analyzeScore[1].name).toBe("keywordDensity");
       expect(analyzeScore[1].score).toBe(9);
       expect(analyzeScore[1].text).toBe("The keyword density is 1.3%, which is great, the keyword was found 2 times.");
       expect(analyzeScore[2].name).toBe("fleschReading");
       expect(analyzeScore[2].score).toBe(5);
       expect(analyzeScore[2].text).toBe("The copy scores 49.0 in the <a href='http://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease'>Flesch Reading Ease</a> test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability.");
       expect(analyzeScore[3].name).toBe("firstParagraph");
       expect(analyzeScore[3].score).toBe(3);
       expect(analyzeScore[3].text).toBe("The keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately.");
       expect(analyzeScore[4].name).toBe("metaDescriptionLength");
       expect(analyzeScore[4].score).toBe(6);
       expect(analyzeScore[4].text).toBe("The meta description is under 120 characters, however up to 156 characters are available.");
       expect(analyzeScore[5].name).toBe("metaDescriptionKeyword");
       expect(analyzeScore[5].score).toBe(3);
       expect(analyzeScore[5].text).toBe("A meta description has been specified, but it does not contain the target keyword / phrase.");
       expect(analyzeScore[6].name).toBe("stopwordKeywordCount");
       expect(analyzeScore[6].score).toBe(5);
       expect(analyzeScore[6].text).toBe("The keyword for this page contains one or more <a href='http://en.wikipedia.org/wiki/Stop_words'>stop words</a>, consider removing them. Found 'about'.");
       expect(analyzeScore[7].name).toBe("subHeadings");
       expect(analyzeScore[7].score).toBe(7);
       expect(analyzeScore[8].name).toBe("pageTitleLength");
       expect(analyzeScore[8].score).toBe(6);
       expect(analyzeScore[8].text).toBe("The page title contains 13 characters, which is less than the recommended minimum of 40 characters. Use the space to add keyword variations or create compelling call-to-action copy.");
       expect(analyzeScore[9].name).toBe("pageTitleKeyword");
       expect(analyzeScore[9].score).toBe(2);
       expect(analyzeScore[9].text).toBe("The keyword / phrase 'about' does not appear in the page title.");
       expect(analyzeScore[10].name).toBe("urlKeyword");
       expect(analyzeScore[10].score).toBe(6);
       expect(analyzeScore[10].text).toBe("The keyword / phrase does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!");
       expect(analyzeScore[11].name).toBe("urlLength");
       expect(analyzeScore[12].name).toBe("urlStopwords");
       expect(analyzeScore[13].name).toBe("imageCount");
       expect(analyzeScore[13].score).toBe(3);
       expect(analyzeScore[13].text).toBe("No images appear in this page, consider adding some as appropriate.");
       expect(analyzeScore[14].name).toBe("linkCount");
       expect(analyzeScore[14].score).toBe(9);
       expect(analyzeScore[14].text).toBe("This page has 1 outbound link(s).");
   });
});