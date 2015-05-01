require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");

scoreArgs = {
    textString: "<p>One of the speakers at our upcoming <a href='https://yoast.com/conference/'>YoastCon</a> is Marcus Tandler, one of my best friends in the industry. I met Marcus&nbsp;almost at the beginning of my career as an&nbsp;SEO consultant, we’ve since&nbsp;had fun at numerous conferences throughout the world, most notably <a href='http://seoktoberfest.net/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://seoktoberfest.net/', 'SEOktoberfest');'>SEOktoberfest</a>, which Marcus organizes in his hometown Munich.</p>    <p>I’m very proud that he’ll be speaking at YoastCon and wanted to show you all, as a warmup, this presentation he gave at TedX Munich, about the (past, present &amp;) future of search:</p><p><div class='fluid-width-video-wrapper' style='padding-top: 56.25%;'><iframe src='https://www.youtube.com/embed/Fa4jQIW2etI?feature=oembed&amp;modestbranding=1&amp;hd=1&amp;rel=0&amp;' frameborder='0' allowfullscreen='' id='fitvid32975'></iframe></div></p><p>At YoastCon, Marcus will <a href='https://yoast.com/conference/program/#marcus-tandler'>talk about the “rise of the machines”</a>: the next big step in search engine ranking. He will explain how Google is now using machine learning and why he thinks links, currently a major factor of the ranking process, will soon become irrelevant.</p><p>We’ve got a few tickets left for <a href='https://yoast.com/conference/'>YoastCon</a>, so if you’re thinking about coming, now would be a good time to <a href='https://yoast.paydro.net/event/yoast-5th-anniversary-congress' onclick='__gaTracker('send', 'event', 'outbound-article', 'https://yoast.paydro.net/event/yoast-5th-anniversary-congress', 'buy your ticket');' rel='nofollow'>buy your ticket</a>!</p><p><span itemprop='video' itemscope='' itemtype='http://schema.org/VideoObject'><meta itemprop='name' content='The future of search'><meta itemprop='thumbnailURL' content='https://yoast.com/wp-content/uploads/2015/04/fa4jqiw2eti.jpg'><meta itemprop='description' content='In this presentation Marcus talks about the past, present and future of search. Check it out and come see Marcus at YoastCon.'><meta itemprop='uploadDate' content='2015-04-29T12:14:38+00:00'><meta itemprop='embedURL' content='https://www.youtube-nocookie.com/v/Fa4jQIW2etI'><meta itemprop='contentURL' content='http://www.youtube.com/v/Fa4jQIW2etI?version=3&amp;f=videos&amp;app=youtube_gdata'><meta itemprop='duration' content='PT18M15S'></span></p>",
    keyword: "keyword",
    url: "http://yoast.com/keyword-search",
    pageTitle: "the pagetitle",
    meta: "the metadescription of the page"
};

describe("a test for the scoring function of all functions in the analyzer", function(){
   it("returns scores for all objects", function(){
       var scoreAnalyzer = new Analyzer(scoreArgs);
       scoreAnalyzer.runQueue();
       var result = scoreAnalyzer.__output;
       expect(result.length).toBe(11);


   });
});