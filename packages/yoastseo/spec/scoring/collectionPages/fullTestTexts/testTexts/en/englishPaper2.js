import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper2.html";

const name = "englishPaper2";

const paper = new Paper( content, {
	keyword: "Wildcrafted hair bars",
	synonyms: "shampoo bar",
	description: "Formulated for all the hair goals without any of the plastic packaging, with healing ingredients derived from the earth.",
	title: "Wildcrafted hair bars",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://unwrappedlife.com/collections/wildcrafted-hair-bars",
	url: "wildcrafted-hair-bars",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms do not " +
			"appear in the first paragraph. <a href='https://yoa.st/shopify9' target='_blank'>Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 0 times. " +
			"That's less than the recommended" +
			" minimum of 5 times for a text of this length. <a href='https://yoa.st/shopify13' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: The meta description has been " +
			"specified, but it does not contain the keyphrase. <a href='https://yoa.st/shopify15' target='_blank'>Fix that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is too short " +
			"(under 120 characters). Up to 156 characters are available. <a href='https://yoa.st/shopify47' target='_blank'>Use the space</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 1602 words. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase " +
			"appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify52' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify26' target='_blank'>Keyphrase in slug</a>: More than half of your keyphrase appears in " +
			"the slug. That's great!",
	},
	functionWordsInKeyphrase: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	singleH1: {
		isApplicable: true,
		score: 1,
		resultText: "<a href='https://yoa.st/shopify54' target='_blank'>Single title</a>: H1s should only be used as your " +
			"main title. Find all H1s in your text that aren't your main title and <a href='https://yoa.st/shopify55' target='_blank'>" +
			"change them to a lower heading level</a>!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify30' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: 1 section of your text is longer " +
			"than 300 words and is not separated by any subheadings. <a href='https://yoa.st/shopify69' target='_blank'>" +
			"Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: 22 of the paragraphs contain more " +
			"than the recommended maximum of 150 words. <a href='https://yoa.st/shopify67' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Only 3.6% of the sentences contain " +
			"transition words, which is not enough. <a href='https://yoa.st/shopify45' target='_blank'>Use more of them</a>.",
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
		score: 3,
		resultText: "<a href='https://yoa.st/shopify5' target='_blank'>Consecutive sentences</a>: The text contains 33 " +
			"instances where 3 or more consecutive sentences start with the same word. <a href='https://yoa.st/shopify65' target='_blank'>" +
			"Try to mix things up</a>!",
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
