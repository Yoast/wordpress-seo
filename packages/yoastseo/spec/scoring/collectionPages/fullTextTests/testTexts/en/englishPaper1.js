import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper1.html";

const name = "englishPaper1";

const paper = new Paper( content, {
	keyword: "variety packs",
	synonyms: "family packs",
	description: "Variety Packs · Crunchy Variety Pack (5 Boxes) · Soft Baked Variety Pack (6 Boxes) · All the Cookies! " +
		"Family Pack (8 Boxes) · Chocolate Lovers Variety Pack · ",
	title: "Variety Packs - Partake Foods",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://partakefoods.com/collections/variety-packs",
	url: "variety-packs",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or " +
			"its synonyms do not appear in the first paragraph. <a href='https://yoa.st/shopify9' target='_blank'>" +
			"Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: false,
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: The meta description " +
			"contains the keyphrase 5 times, which is over the advised maximum of 2 times. <a href='https://yoa.st/shopify15' " +
			"target='_blank'>Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is over 156 characters." +
			" To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' target='_blank'>you should reduce the length</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 49 words. This is " +
			"below the recommended minimum of 80 words. <a href='https://yoa.st/shopify59' target='_blank'>Add more content</a>.",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in title</a>: The exact match of the focus " +
			"keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify52' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
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
		score: 0,
		resultText: "",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify30' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: false,
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		// The text contains less than 200 words
		isApplicable: false,
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify42' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify5' target='_blank'>Consecutive sentences</a>: There is enough " +
			"variety in your sentences. That's great!",
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
