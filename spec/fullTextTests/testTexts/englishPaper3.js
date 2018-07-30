const Paper = require( "../../../js/values/Paper.js" );

const name = "englishPaper3";

const paper = new Paper( "<h2>Which social media platform suits your business?</h2>\n" +
	"<p>The first step in determining a social media strategy is whether that social medium is one that you&#8217;d <em>want</em> to be found on. In other words, does the social medium suit the message and branding of your company? And on top of that: does this social medium offer the options and reach you&#8217;re looking for?<br />\n" +
	"</div><section class=\"alignright extra show-off\"><p><a class=\"link--naked link--cta\" href=\"https://yoast.com/academy/course/seo-copywriting-training/\">Learn how to write awesome and SEO friendly articles in our <span>SEO Copywriting training</span> &raquo;</a></p><a class=\"hide-on-mobile \" href=\"https://yoast.com/academy/course/seo-copywriting-training/\"><img src=\"https://yoast.com/app/uploads/2016/05/Copywriting_course_banner.png\" alt=\"SEO copywriting training\"></a><div class=\"plugin-buy-button\"><a href=\"https://yoast.com/eu/cart/?add-to-cart=37\" class=\"buy-button button default \" rel=\"nofollow\" data-product-id=\"37\" data-product-name=\"SEO copywriting training\" data-price=\"199\" data-currency=\"EUR\"><span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&euro;</span>199</span> - Buy now &raquo;</a></div><a href=\"https://yoast.com/academy/course/seo-copywriting-training/\" class=\"button dimmed flat\"><i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i> Info</a></section><div class=\"content\"><br />\n" +
	"Social media platforms like Facebook and Twitter offer a lot of ways to advertise and make your brand and company known beyond the scope of your followers. With other social media, this can be more difficult and it would require a lot of hard work to get the same results. Make sure to think about what presence on the considered social media would mean for your company. Make sure that this aligns with how you want to brand your business.</p>\n" +
	"<h2>Which social media does your (desired) audience use?</h2>\n" +
	"<p>Different kinds of people use different kinds of social media. So you have to know what social media your audience uses. And for you to know that, you&#8217;ll have to <a href=\"https://yoast.com/analyzing-your-audience-a-how-to/\">get to know your audience</a>. This requires some effort and research, but it will definitely be worth it. For instance, if your company mainly works in the business-to-business area, you should certainly be active on LinkedIn. And if you have a young audience, your business is best off using social media such as Snapchat, Vine, Tumblr and Instagram:</p>\n" +
	"<p><img class=\"alignnone wp-image-649602 size-large\" src=\"https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-600x385.png\" alt=\"Image2_Social_media_strategy\" width=\"600\" height=\"385\" srcset=\"https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-600x385.png 600w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-250x160.png 250w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-768x493.png 768w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-234x150.png 234w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy.png 1200w\" sizes=\"(max-width: 600px) 100vw, 600px\" /></p>\n" +
	"<h2>Social media you can&#8217;t ignore</h2>\n" +
	"<p>At the moment there&#8217;s basically only one social medium you really can&#8217;t ignore and that&#8217;s Facebook. Why? Let me show you:</p>\n" +
	"<p><img class=\"alignnone wp-image-649599 size-large\" src=\"https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-600x500.png\" alt=\"Image3_Social_media_strategy\" width=\"600\" height=\"500\" srcset=\"https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-600x500.png 600w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-250x208.png 250w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-768x640.png 768w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-180x150.png 180w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy.png 1200w\" sizes=\"(max-width: 600px) 100vw, 600px\" /></p>\n" +
	"<p>Facebook currently has nearly 1.5 billion active users <em>every month</em>. That&#8217;s over 20% of the entire world population who are on Facebook at least once a month. So you can see why this is one bandwagon you&#8217;ll want to get on.</p>\n" +
	"<p>A blog or website should thus definitely have its own Facebook page. And your posts should all be shared on Facebook. That way, all the people who follow your page see new posts on their timeline. WordPress can do this automatically for you when you publish an article. Some people will like, share or comment on the Facebook posts, giving them even more exposure.</p></div>", {
		keyword: "social media strategy",
		description: "Social media should be a part of your SEO strategy. In this post, Marieke explains the first steps towards developing your own social media strategy.",
		title: "Social Media Strategy: Where to begin?",
		titleWidth: 450,
		locale: "en_EN",
		url: "https://yoast.com/social-media-strategy-where-to-begin/",
		synonyms: "social media SEO strategy",
	} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy.",
	},
	keyphraseLength: {
		score: 0,
		resultText: "",
	},
	keywordDensity: {
		score: 4,
		resultText: "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 0.3%, which is too low; the focus keyword was found 1 time.",
	},
	keywordStopWords: {
		score: 0,
		resultText: "",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "The meta description <a href='https://yoa.st/2pf' target='_blank'> contains the focus keyword</a>.",
	},
	metaDescriptionLength: {
		score: 9,
		resultText: "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> has a nice length.",
	},
	subheadingsKeyword: {
		score: 6,
		resultText: "You have not used the focus keyword in any <a href='https://yoa.st/2ph' target='_blank'>subheading</a> (such as an H2) in your copy.",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 6,
		resultText: "The <a href='https://yoa.st/2pj' target='_blank'>images</a> on this page do not have alt attributes containing the focus keyword.",
	},
	textLength: {
		score: 9,
		resultText: "The text contains 388 words. This is more than or equal to the <a href='https://yoa.st/2pk' target='_blank'>recommended minimum</a> of 300 words.",
	},
	externalLinks: {
		score: 8,
		resultText: "This page has 1 nofollowed <a href='https://yoa.st/2pl' target='_blank'>outbound link(s)</a> and 4 normal outbound link(s).",
	},
	internalLinks: {
		score: 3,
		resultText: "No <a href='https://yoa.st/2pm' target='_blank'>internal links</a> appear in this page, consider adding some as appropriate.",
	},
	titleKeyword: {
		score: 9,
		resultText: "The <a href='https://yoa.st/2pn' target='_blank'>SEO title</a> contains the focus keyword, at the beginning which is considered to improve rankings.",
	},
	titleWidth: {
		score: 9,
		resultText: "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> has a nice length.",
	},
	urlKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page.",
	},
	urlLength: {
		score: 6,
		resultText: "The slug for this page is a bit long, consider shortening it.",
	},
	urlStopWords: {
		score: 5,
		resultText: "The slug for this page contains <a href='http://en.wikipedia.org/wiki/Stop_words' target='_blank'>stop words</a>, consider removing it.",
	},
	largestKeywordDistance: {
		score: 1,
		resultText: "Large parts of your text do not contain the keyword. Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> the keyword more evenly.",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "The copy scores 66.7 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered ok to read. ",
	},
	subheadingsTooLong: {
		score: 9,
		resultText: "Great job with using <a href='https://yoa.st/headings' target='_blank'>subheadings</a>!",
	},
	textParagraphTooLong: {
		score: 9,
		resultText: "None of the paragraphs are too long, which is great.",
	},
	textSentenceLength: {
		score: 9,
		resultText: "13.3% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, which is less than or equal to the recommended maximum of 25%.",
	},
	textTransitionWords: {
		score: 9,
		resultText: "36.7% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> or phrase, which is great.",
	},
	passiveVoice: {
		score: 9,
		resultText: "6.7% of the sentences contain <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, which is less than or equal to the recommended maximum of 10%.",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 0,
		resultText: "",
	},
};

module.exports = {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};

