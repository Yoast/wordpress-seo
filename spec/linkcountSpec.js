require("../js/config/config.js");
require("../js/analyzer.js");

var linkArgs = {
    textString: "<p><img class='alignright wp-image-320928 size-medium' title='Cornerstone Content' src='https://yoast.com/wp-content/uploads/2011/12/pyramide_cornerstone-250x199.png' alt='' width='250' height='199'>The most common question we answer in our <a title='Website Review' href='https://yoast.com/hire-us/website-review/'>website reviews</a> is <em>“how do I make my site rank for keyword X?”</em>. What most people don’t realize is that they’re asking the wrong question. You see, sites don’t rank: pages rank. If you want to rank for a keyword, you’ll need to determine which page is going to be the page ranking for that keyword.</p><p>Adding that keyword to the title of <em>every</em> page is not going to help. Nor is writing 200 articles about it without one central article to link all those articles to. You need one single page that is the center of the content about that topic. One “hub” page, if you will.</p><p>That page will need to be 100% awesome in all ways. Brian Clark of Copyblogger calls this type of content “cornerstone content” and has written&nbsp;<a href='http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/', 'an awesome article about it');' target='_blank'>an awesome article about it</a>&nbsp;(a few years ago, already). In fact, go and read Brian’s article, he explains that way better than I can, I’ll wait You’re back? Ok, read on:</p>",
    queue: ["linkCount"]
};

describe("A test to count links in a given text", function(){
    linkAnalyzer = new Analyzer(linkArgs);
    it("link counter for first string", function(){
      expect(linkAnalyzer.linkCount()).toBe(2);
    });
});