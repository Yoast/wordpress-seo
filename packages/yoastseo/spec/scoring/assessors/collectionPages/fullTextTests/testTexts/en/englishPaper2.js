import Paper from "../../../../../../../src/values/Paper.js";
import content from "./englishPaper2.html";

const name = "englishPaper2";

const paper = new Paper( content, {
	keyword: "Science fiction",
	synonyms: "sci-fi",
	description: "Science fiction (sometimes shortened to sci-fi or SF) is a genre of speculative fiction that typically deals " +
		"with imaginative and futuristic concepts such as advanced science and technology, space exploration, " +
		"time travel, parallel universes, and extraterrestrial life.",
	title: "Science fiction",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://en.wikipedia.org/wiki/Science_fiction",
	slug: "https://en.wikipedia.org/wiki/Science_fiction",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: -50,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The keyphrase was found 5 times. " +
			"That's way more than the recommended maximum of 4 times for a text of this length." +
			" <a href='https://yoa.st/shopify13' target='_blank'>Don't overoptimize</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: The meta description " +
			"contains the keyphrase 3 times, which is over the advised maximum of 2 times. <a href='https://yoa.st/shopify15' " +
			"target='_blank'>Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is " +
			"over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' " +
			"target='_blank'>you should reduce the length</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 166 words. Good job!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in SEO title</a>: The exact match of the focus keyphrase " +
			"appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify52' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify26' target='_blank'>Keyphrase in slug</a>: Great work!",
	},
	functionWordsInKeyphrase: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	singleH1: {
		isApplicable: true,
		score: 8,
		resultText: "<a href='https://yoa.st/shopify54' target='_blank'>Single title</a>: You don't have multiple H1 headings, well done!",
	},
	keyphraseDistribution: {
		// The text doesn't contain more than 15 sentences.
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: You are not using any subheadings," +
			" but your text is short enough and probably doesn't need them.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: There are no paragraphs that are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify42' target='_blank'>Passive voice</a>: 20% of the sentences contain passive voice, " +
			"which is more than the recommended maximum of 10%. <a href='https://yoa.st/shopify43' target='_blank'>" +
			"Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify5' target='_blank'>Consecutive sentences</a>: There are no repetitive sentence beginnings. That's great!",
	},
	wordComplexity: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify77' target='_blank'>Word complexity</a>: You are not using too many complex words, which makes " +
			"your text easy to read. Good job!",
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
