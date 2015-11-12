require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var linkArgs = {
    text: "<p><img class='alignright wp-image-320928 size-medium' title='Cornerstone Content' src='https://yoast.com/wp-content/uploads/2011/12/pyramide_cornerstone-250x199.png' alt='' width='250' height='199'>The most common question we answer in our <a title='Website Review' href='https://yoast.com/hire-us/website-review/'>website reviews</a> is <em>“how do I make my site rank for keyword X?”</em>. What most people don’t realize is that they’re asking the wrong question. You see, sites don’t rank: pages rank. If you want to rank for a keyword, you’ll need to determine which page is going to be the page ranking for that keyword.</p><p>Adding that keyword to the title of <em>every</em> page is not going to help. Nor is writing 200 articles about it without one central article to link all those articles to. You need one single page that is the center of the content about that topic. One “hub” page, if you will.</p><p>That page will need to be 100% awesome in all ways. Brian Clark of Copyblogger calls this type of content “cornerstone content” and has written&nbsp;<a href='http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/', 'an awesome article about it');' target='_blank'>an awesome article about it</a>&nbsp;(a few years ago, already). In fact, go and read Brian’s article, he explains that way better than I can, I’ll wait You’re back? Ok, read on:</p>",
    queue: ["linkCount"]
};

describe("A test to count links in a given text", function(){
    it("link counter for first string", function(){
        var linkAnalyzer = new Factory.buildAnalyzer(linkArgs);
        var result = linkAnalyzer.linkCount();
        expect(result[0].result.total).toBe(2);
    });
});

var linkArgs2 = {
    text: "<p><img class='alignright wp-image-320928 size-medium' title='Cornerstone Content' src='https://yoast.com/wp-content/uploads/2011/12/pyramide_cornerstone-250x199.png' alt='' width='250' height='199'>The most common question we answer in our <a title='Website Review' href='https://yoast.com/hire-us/website-review/' rel='nofollow'>website reviews</a> is <em>“how do I make my site rank for keyword X?”</em>. What most people don’t realize is that they’re asking the wrong question. You see, sites don’t rank: pages rank. If you want to rank for a keyword, you’ll need to determine which page is going to be the page ranking for that keyword.</p><p>Adding that keyword to the title of <em>every</em> page is not going to help. Nor is writing 200 articles about it without one central article to link all those articles to. You need one single page that is the center of the content about that topic. One “hub” page, if you will.</p><p>That page will need to be 100% awesome in all ways. Brian Clark of Copyblogger calls this type of content “cornerstone content” and has written&nbsp;<a href='http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/', 'an awesome article about it');' target='_blank'>an awesome article about it</a>&nbsp;(a few years ago, already). In fact, go and read Brian’s article, he explains that way better than I can, I’ll wait You’re back? Ok, read on:</p>",
    queue: ["linkCount"],
    url: "yoast.com"
};

var linkArgs3 = {
    text: "Lorem ipsum dolor sit amet, <a href='http://yoast.com'>consectetur</a> adipiscing elit. <a href='http://google.com'>urabitur aliquet</a> vel ipsum non feugiat. Aenean purus turpis, rhoncus a vestibulum at, ornare et enim. Donec et imperdiet sem. Mauris in efficitur odio, sit amet aliquam eros. <a href='ftp://Morbi.com'>suscipit</a>, leo tincidunt malesuada rhoncus, odio sem ornare erat, sed aliquet magna odio sed lectus. Quisque tempus iaculis enim, in dignissim diam elementum sit amet. Proin elit augue, varius sed diam sed, iaculis varius risus. Morbi fringilla eleifend gravida.Integer nec magna ex. <a href='http://Suspendisse.nl' target='blank'>ornare</a> ultrices tellus, sit amet consequat libero faucibus a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt, orci eu lacinia maximus, ex arcu ultricies turpis, elementum feugiat est neque eget risus. Nam pulvinar sagittis arcu vitae <a href='http://yoast.com' rel='nofollow'>iaculis.</a> In leo augue, congue sit amet molestie eget, aliquet vitae tellus. Suspendisse at nisl a velit eleifend posuere. Nulla vulputate, lorem sit amet facilisis condimentum, eros orci vulputate urna, vitae ullamcorper elit velit et lectus. Sed accumsan magna et ultrices tempor. Vivamus euismod mi <a href='http://example.com' rel='nofollow'>sed</a> nunc semper dapibus.",
    queue: ["linkCount"],
    url: "yoast.com"
};

describe("A test to determine the type of links in a given text", function(){
   it("link types from first string", function(){
       var linkAnalyzer2 = new Factory.buildAnalyzer(linkArgs2);
       var result = linkAnalyzer2.linkCount();
       expect(result[0].result.internalNofollow).toBe(1);
       expect(result[0].result.externalDofollow).toBe(1);
   });
   it("link types from text with different types of links", function(){
       var linkAnalyzer3 = new Factory.buildAnalyzer(linkArgs3);
       var result = linkAnalyzer3.linkCount();
       expect(result[0].result.total).toBe(6);
       expect(result[0].result.internalNofollow).toBe(1);
       expect(result[0].result.internalDofollow).toBe(1);
       expect(result[0].result.internalTotal).toBe(2);
       expect(result[0].result.externalTotal).toBe(3);
       expect(result[0].result.externalNofollow).toBe(1);
       expect(result[0].result.externalDofollow).toBe(2);
       expect(result[0].result.otherTotal).toBe(1);
   });
});

var linkArgs4 = {
    text: "<p><img class='alignright wp-image-320928 size-medium' title='Cornerstone Content' src='https://yoast.com/wp-content/uploads/2011/12/pyramide_cornerstone-250x199.png' alt='' width='250' height='199'>The most common question we answer in our <a title='Website Review' href='https://yoast.com/hire-us/website-review/' rel='nofollow'>website reviews</a> is <em>“how do I make my site rank for keyword X?”</em>. What most people don’t realize is that they’re asking the wrong question. You see, sites don’t rank: pages rank. If you want to rank for a keyword, you’ll need to determine which page is going to be the page ranking for that keyword.</p><p>Adding that keyword to the title of <em>every</em> page is not going to help. Nor is writing 200 articles about it without one central article to link all those articles to. You need one single page that is the center of the content about that topic. One “hub” page, if you will.</p><p>That page will need to be 100% awesome in all ways. Brian Clark of Copyblogger calls this type of content “cornerstone content” and has written&nbsp;<a href='http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/' onclick='__gaTracker('send', 'event', 'outbound-article', 'http://www.copyblogger.com/how-to-create-cornerstone-content-that-google-loves/', 'an awesome article about it');' target='_blank'>an awesome article about it</a>&nbsp;(a few years ago, already). In fact, go and read Brian’s article, he explains that way better than I can, I’ll wait You’re back? Ok, read on:</p>",
    queue: ["linkCount"]
};

describe("A test to check links in a given text, without an URL in the config", function(){
    it("returns only external links", function(){
       var linkAnalyzer4 = new Factory.buildAnalyzer(linkArgs4);
       var result = linkAnalyzer4.linkCount();
       expect(result[0].result.total).toBe(2);
       expect(result[0].result.externalTotal).toBe(2);
       expect(result[0].result.internalTotal).toBe(0);
    });
});

var linkArgs5 = {
	text: "<p>The most common question we answer in our <a title='Website Review' href='https://yoast.com/hire-us/website-review/' rel='nofollow'> <img class='alignright wp-image-320928 size-medium' title='Cornerstone Content' src='https://yoast.com/wp-content/uploads/2011/12/pyramide_cornerstone-250x199.png' alt='keyword' width='250' height='199'> website reviews</a> is <em>“how do I make my site rank for keyword X?”</em>. What most people don’t realize is that they’re asking the wrong question. You see, sites don’t rank: pages rank. If you want to rank for a keyword, you’ll need to determine which page is going to be the page ranking for that keyword.</p><p>Adding that keyword to the title of <em>every</em> page is not going to help. Nor is writing 200 articles about it without one central article to link all those articles to. You need one single page that is the center of the content about that topic. One “hub” page, if you will.</p><p>That page will need to be 100% awesome in all ways. Brian Clark of Copyblogger calls this type of content “cornerstone content” and has written&nbsp;&nbsp;(a few years ago, already). In fact, go and read Brian’s article, he explains that way better than I can, I’ll wait You’re back? Ok, read on:</p>",
	queue: ["linkCount"],
	keyword: "keyword"

};

describe("A test to check for the keyword in the URL with an image. ", function(){
	it("should not report the keyword found in the link, since it is not used in the href, only in the alt-tag of the enclosed image", function(){
		var linkAnalyzer5 = new Factory.buildAnalyzer(linkArgs5);
		var result = linkAnalyzer5.linkCount();
		expect(result[0].result.totalKeyword).toBe(0);
	});
});

var linkArgs6 = {
	text:"<p><a href='https://keyword-linkje.com'>keyword</a> text with keyword link, should match, since the keyword is separated with a -</p>",
	queue: ["linkCount"],
	keyword: "keyword"
};

describe("A test to check for the keyword in the URL", function(){
	it("should match the keyword, since it is found in the href", function(){
		var linkAnalyzer6 = new Factory.buildAnalyzer(linkArgs6);
		var result = linkAnalyzer6.linkCount();
		expect(result[0].result.totalKeyword).toBe(1);
	});
});

var linkArgs7 = {
	text:"<p><a>keyword</a> text with keyword link, should match</p>",
	queue: ["linkCount"],
	keyword: "keyword"
};

describe("A test to check for errors", function(){
	it("should not fail the test, but return 0 since the anchor has no href", function(){
		var linkAnalyzer7 = new Factory.buildAnalyzer(linkArgs7);
		var result = linkAnalyzer7.linkCount();
		expect(result[0].result.totalKeyword).toBe(0);
	});
});

var linkArgs8 = {
	text:"<p><a href='https://keywordlinkje.com'>keyword</a> text with keyword link, should not match, since the keyword is part of the total link</p>",
	queue: ["linkCount"],
	keyword: "keyword"
};

describe("A test to check for the keyword in the URL", function(){
	it("should match the keyword, since it is found in the href", function(){
		var linkAnalyzer6 = new Factory.buildAnalyzer(linkArgs8);
		var result = linkAnalyzer6.linkCount();
		expect(result[0].result.totalKeyword).toBe(0);
	});
});