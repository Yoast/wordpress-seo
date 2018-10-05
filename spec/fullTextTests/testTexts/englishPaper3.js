import Paper from "../../../src/values/Paper";

const name = "englishPaper3";

const paper = new Paper( "<div class=\"content content__first\">\n" +
	"<p>Social media is a necessary part of any marketing strategy, but it should also be a part of your SEO strategy. As social media is becoming more popular, Google and other search engines can’t ignore it any longer. Tweets and Facebook posts don’t get the highest rankings in Google, but Facebook pages and profiles for sure do. But how do you know which social media to use?&nbsp;In this post, I’ll walk you through the first steps of determining&nbsp;a social media strategy: finding the social media platform that suits both your business and your audience.</p>\n" +
	"<h2>Which social media platform suits your business?</h2>\n" +
	"<p>The first step in determining&nbsp;a social media strategy is whether that social medium is one that you’d&nbsp;<em>want</em> to be found on. In other words, does the social medium suit the message and branding of your company? And on top of that: does this social medium offer the options and reach you’re looking for?<br>\n" +
	"</p></div>\n" +
	"<div class=\"content\"><br>\n" +
	"Social media platforms like Facebook and Twitter offer a lot of ways to advertise and make your brand and company known beyond the scope of your followers. With other social media, this can be more difficult and it would require a lot of hard work to get the same results.&nbsp;Make sure to think about what presence on the considered social media would mean for your company. Make sure that this aligns with how you want to brand your business.<p></p>\n" +
	"<h2>Which social media does your (desired) audience use?</h2>\n" +
	"<p>Different kinds of people use different kinds of social media. So you have to know what social media your audience uses. And for you to know that, you’ll have to <a href=\"https://yoast.com/analyzing-your-audience-a-how-to/\">get to know your audience</a>. This requires some effort and research, but it will definitely be worth it. For instance, if your company mainly works in the business-to-business area, you&nbsp;should certainly be active on LinkedIn. And if you have a young audience, your business is best off using social media such as Snapchat, Vine, Tumblr and Instagram:</p>\n" +
	"<p><img class=\"alignnone wp-image-649602 size-large\" src=\"https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-600x385.png\" alt=\"Image2_Social_media_strategy\" width=\"600\" height=\"385\" srcset=\"https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-600x385.png 600w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-250x160.png 250w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-768x493.png 768w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy-234x150.png 234w, https://yoast.com/app/uploads/2015/09/Image2_Social_media_strategy.png 1200w\" sizes=\"(max-width: 600px) 100vw, 600px\"></p>\n" +
	"<h2>Social media you can’t ignore</h2>\n" +
	"<p>At the moment there’s basically only one social medium you really can’t ignore and that’s Facebook. Why? Let me show you:</p>\n" +
	"<p><img class=\"alignnone wp-image-649599 size-large\" src=\"https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-600x500.png\" alt=\"Image3_Social_media_strategy\" width=\"600\" height=\"500\" srcset=\"https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-600x500.png 600w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-250x208.png 250w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-768x640.png 768w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy-180x150.png 180w, https://yoast.com/app/uploads/2015/09/Image3_Social_media_strategy.png 1200w\" sizes=\"(max-width: 600px) 100vw, 600px\"></p>\n" +
	"<p>Facebook currently has nearly 1.5 billion active users&nbsp;<em>every month</em>. That’s over 20% of the entire world population who are on Facebook at least once a month. So you can see why this is one bandwagon you’ll want to get on.</p>\n" +
	"<p>A blog or website should thus definitely have its own Facebook page. And your posts should all be shared on Facebook. That way, all the people who follow your page see new posts on their timeline. WordPress can do this automatically for you when you publish an article. Some people will like, share or comment on the Facebook posts, giving them even more exposure.</p>\n" +
	"<h2>Think about your social media strategy!</h2>\n" +
	"<p>The main thing you should take away from this post is that you&nbsp;should determine&nbsp;your social media strategy, before your start. It’s easy&nbsp;to waste time, effort and money on the wrong media and/or the wrong goals.&nbsp;So bear in mind these 3&nbsp;key&nbsp;questions :</p>\n" +
	"<ul>\n" +
	"<li>Who do I want to reach with social media?</li>\n" +
	"<li>Which social media suits my business?</li>\n" +
	"<li>On which social media&nbsp;do&nbsp;I find my target group?</li>\n" +
	"</ul>\n" +
	"</div>", {
	keyword: "social media strategy",
	description: "Social media should be a part of your SEO strategy. In this post, Marieke explains the first steps towards developing your own social media strategy.",
	title: "Social Media Strategy: Where to begin?",
	titleWidth: 450,
	locale: "en_EN",
	url: "https://yoast.com/social-media-strategy-where-to-begin/",
	synonyms: "social media SEO strategy, Facebook strategy",
} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.9%. This is great!",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Key phrase in meta description</a>: Focus key phrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: More than 75% of your subheadings reflect the topic of your copy. That's too much. <a href='https://yoa.st/33n' target='_blank'>Don't over-optimize</a>!",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 6,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!",
	},
	textLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 529 words. Good job!",
	},
	externalLinks: {
		score: 8,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!",
	},
	internalLinks: {
		score: 3,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: No internal links appear in this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!",
	},
	titleKeyword: {
		score: 9,
		resultText: "The exact match of the focus keyphrase appears at the beginning of the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>, which is considered to improve rankings.",
	},
	titleWidth: {
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page.",
	},
	urlLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!",
	},
	urlStopWords: {
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains stop words. <a href='https://yoa.st/34q' target='_blank'>Remove them</a>!",
	},
	keyphraseDistribution: {
		score: 9,
		resultText: "<a href='https://yoa.st/33q target='_blank'>Keyphrase distribution</a>: Good job!",
	},

	fleschReadingEase: {
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 63.8 in the test, which is considered ok to read. Good job!",
	},
	subheadingsTooLong: {
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
};

export {
	name,
	paper,
	expectedResults,
};

export default {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
