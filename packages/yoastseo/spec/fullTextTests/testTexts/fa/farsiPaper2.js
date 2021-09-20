import Paper from "../../../../src/values/Paper.js";
import content from "./farsiPaper2.html";

const name = "farsiPaper2";

const paper = new Paper( content, {
	keyword: "سیستان و بلوچستان",
	synonyms: "اعتراضات",
	description: "اعتراضات اسفندماه ۱۳۹۹ در استان سیستان و بلوچستان مجموعه اعتراضاتی است که در واکنش به کشته‌شدن سوخت‌بران توسط سپاه پاسداران در شهرستان سراوان صورت گرفت. به گزارش منابع خبری، همچنین اینترنت و شبکه موبایل در بیشتر شهرهای استان در پی اعتراضات قطع یا دچار اختلال شد.",
	title: "اعتراضات سیستان و بلوچستان",
	titleWidth: 450,
	locale: "fa_IR",
	permalink: "https://fa.wikipedia.org/wiki/%D8%A7%D8%B9%D8%AA%D8%B1%D8%A7%D8%B6%D8%A7%D8%AA_%D8%B3%DB%8C%D8%B3%D8%AA%D8%A7%D9%86_%D9%88_%D8%A8%D9%84%D9%88%DA%86%D8%B3%D8%AA%D8%A7%D9%86",
	url: "اعتراضات_سیستان_و_بلوچستان",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 8 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in meta description</a>: The meta description contains the" +
			" keyphrase 4 times, which is over the advised maximum of 2 times. Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: " +
			"The meta description is over 156 characters. To ensure the entire description will be visible," +
			" you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: Use" +
			" more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 2,
		resultText: "Link keyphrase</a>: You're linking to another page with the words" +
			" you want this page to rank for. Don't do that</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 1025 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "Outbound links</a>: No outbound links appear in this page." +
			" Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase appears" +
			" in the SEO title, but not at the beginning. Move it to the beginning for the" +
			" best results</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in slug</a>: More than half of your keyphrase " +
			"appears in the slug. That's great!",
	},
	urlLength: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	urlStopWords: {
		isApplicable: false,
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 6,
		resultText: "Transition words</a>: Only 23.1% of the sentences contain transition words, which is not enough. Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "Passive voice</a>: 14.3% of the sentences contain passive voice, which is more than the recommended maximum of 10%. Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
	imageKeyphrase: {
		// This is not applicable to this paper since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "Images</a>: No images appear on this page." +
			" Add some</a>!",
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
