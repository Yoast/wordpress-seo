import Paper from "../../../../src/values/Paper.js";
import content from "./englishPaper.html";

const name = "englishPaper";

const paper = new Paper( content, {
	keyword: "voice search",
	synonyms: "listening and reading in search, voice query, voice results",
	description: "Voice search is gaining popularity. But what will the future bring? Joost and Marieke discuss the pros and cons of voice and describe a possible future scenario.",
	title: "Voice search: what will the future bring?",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://yoast.com/future-of-voice-search/",
	slug: "future-of-voice-search",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
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
			"The focus keyphrase was found 11 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"2 of your H2 and H3 subheadings reflect the topic of your copy. Good job!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 721 words. Good job!",
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
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!",
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
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 75.8 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
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
		// This is not applicable to English Paper 1 since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page." +
			" <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
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
