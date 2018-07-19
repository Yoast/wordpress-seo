const Paper = require( "../../js/values/Paper.js" );

const name = "englishPaper1";

const paper = new Paper( "This is a very interesting paper <a href='https://yoa.st/2pc' target='_blank'>one two three a a a a a a a a a a</a> something <h2> one two three a a a a a a a a a a heading </h2> one two three a a a a a a a a a a.", {
	keyword: "one two three a a a a a a a a a",
	description: "One two three a a a a a a a a a a something.",
	title: "something title",
	titleWidth: 300,
	locale: "en_EN",
	url: "http://test.com/one-two-three-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a-a",
} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy.",
	},
	keyphraseLength: {
		score: 0,
		resultText: "The <a href=\'https://yoa.st/2pd\' target=\'_blank\'>keyphrase</a> is over 10 words, a keyphrase should be shorter.",
	},
	keywordDensity: {
		score: -50,
		resultText: "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 6.4%, which is way over the advised 2.5% maximum; the focus keyword was found 3 times.",
	},
	keywordStopWords: {
		score: 0,
		resultText: "The focus keyword contains a stop word. This may or may not be wise depending on the circumstances. <a href='https://yoa.st/stopwords/' target='_blank'>Learn more about the stop words</a>.",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>.",
	},
	metaDescriptionLength: {
		score: 6,
		resultText: "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> is under 120 characters long. However, up to 156 characters are available.",
	},
	subheadingsKeyword: {
		score: 9,
		resultText: "The focus keyword appears in 1 (out of 1) <a href='https://yoa.st/2ph' target='_blank'>subheadings</a> in your copy.",
	},
	textCompetingLinks: {
		score: 2,
		resultText: "You're <a href='https://yoa.st/2pi' target='_blank'>linking to another page with the focus keyword</a> you want this page to rank for. Consider changing that if you truly want this page to rank.",
	},
	textImages: {
		score: 3,
		resultText: "No <a href='https://yoa.st/2pj' target='_blank'>images</a> appear in this page, consider adding some as appropriate.",
	},
	textLength: {
		score: -20,
		resultText: "The text contains 47 words. This is far below the <a href='https://yoa.st/2pk' target='_blank'>recommended minimum</a> of 300 words. Add more content that is relevant for the topic.",
	},
	externalLinks: {
		score: 8,
		resultText: "This page has 0 nofollowed <a href='https://yoa.st/2pl' target='_blank'>outbound link(s)</a> and 1 normal outbound link(s).",
	},
	internalLinks: {
		score: 3,
		resultText: "No <a href='https://yoa.st/2pm' target='_blank'>internal links</a> appear in this page, consider adding some as appropriate.",
	},
	titleKeyword: {
		score: 2,
		resultText: "The focus keyword 'one two three a a a a a a a a a' does not appear in the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>.",
	},
	titleWidth: {
		score: 6,
		resultText: "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> is too short. Use the space to add keyword variations or create compelling call-to-action copy.",
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
		resultText: "The slug for this page contains a <a href='http://en.wikipedia.org/wiki/Stop_words' target='_blank'>stop word</a>, consider removing it.",
	},
	largestKeywordDistance: {
		score: 9,
		resultText: "Your keyword is <a href='https://yoa.st/2w7' target='_blank'>distributed</a> evenly throughout the text. That's great.",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "The copy scores 91.9 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered very easy to read. ",
	},
};

module.exports = {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
