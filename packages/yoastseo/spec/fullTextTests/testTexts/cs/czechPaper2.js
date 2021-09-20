import Paper from "../../../../src/values/Paper.js";
import content from "./czechPaper2.html";

const name = "czechPaper2";

const paper = new Paper( content, {
	keyword: "Kočka divoká",
	synonyms: "Felis silvestris",
	description: "Kočka divoká (Felis silvestris) je savec z čeledi kočkovitých. Šelmu vědecky popsal a zařadil německý přírodovědec " +
		"Johann Schreber v roce 1777. Patří do podčeledi malé kočky a rodu Felis.",
	title: "Kočka divoká",
	titleWidth: 450,
	locale: "cs_CZ",
	permalink: "https://cs.wikipedia.org/wiki/Ko%C4%8Dka_divok%C3%A1",
	url: "Ko%C4%8Dka_divok%C3%A1",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in introduction</a>: Your keyphrase or its synonyms " +
			"do not appear in the first paragraph. Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 38 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear " +
			"in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is over 156 " +
			"characters. To ensure the entire description will be visible, " +
			"you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 3024 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Outbound links</a>: Good job!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase " +
			"appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase in slug</a>: (Part of) your keyphrase does not appear " +
			"in the slug. Change that</a>!",
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
		score: 3,
		resultText: "Subheading distribution</a>: 3 sections of your text are longer " +
			"than 300 words and are not separated by any subheadings. Add subheadings " +
			"to improve readability</a>.",
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
		score: 9,
		resultText: "Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 3,
		resultText: "Consecutive sentences</a>: The text contains 7 instances where 3 or " +
			"more consecutive sentences start with the same word. Try to mix things up</a>!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "Image Keyphrase</a>: Out of 10 images on this page, only 1 has an alt attribute" +
			" that reflects the topic of your text. Add your keyphrase or synonyms to the alt tags" +
			" of more relevant images</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "Images</a>: Good job!",
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

