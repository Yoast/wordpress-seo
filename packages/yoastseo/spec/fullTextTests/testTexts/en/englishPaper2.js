import Paper from "../../../../src/values/Paper.js";
import content from "./englishPaper2.html";

const name = "englishPaper2";

const paper = new Paper( content, {
	keyword: "Google Search Console data",
	synonyms: "Google Click Through Rate, Google CTR",
	description: "Google Search Console has a totally new interface! And new features: e.g. 16 months of data. Annelieke explains what you can do with it!",
	title: "Annelieke's Analytics: 16 months of Google Search Console data",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://yoast.com/16-months-of-google-search-console-data/",
	url: "16-months-of-google-search-console-data",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 6 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: The meta description has been specified, but it does not contain the keyphrase. <a href='https://yoa.st/33l' target='_blank'>Fix that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"1 of your H2 and H3 subheadings reflects the topic of your copy. Good job!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 908 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase appears in the SEO title, but not at the beginning. <a href='https://yoa.st/33h' target='_blank'>Move it to the beginning for the best results</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: More than half of your keyphrase appears in the slug. That's great!",
	},
	urlLength: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	urlStopWords: {
		isApplicable: true,
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. Some parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 75.1 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
		"2 sections of your text are longer than 300 words and are not separated by any subheadings." +
		" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Images on this page do not have alt attributes " +
			"that reflect the topic of your text. <a href='https://yoa.st/4f6' target='_blank'>Add your keyphrase or synonyms to the alt tags " +
			"of relevant images</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!",
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

