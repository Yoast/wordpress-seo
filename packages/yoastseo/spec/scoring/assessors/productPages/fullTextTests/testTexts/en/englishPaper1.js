import Paper from "../../../../../../../src/values/Paper.js";
import content from "./englishPaper1.html";

const name = "englishPaper1";

const paper = new Paper( content, {
	keyword: "Cat toys",
	synonyms: "cat entertainment",
	description: "Cat play and toys incorporates predatory games of \"play aggression.\" Cats' behaviors when playing are " +
		"similar to hunting behaviors.",
	title: "Cat play and toys",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://en.wikipedia.org/wiki/Cat_play_and_toys",
	slug: "Cat_play_and_toys",
	customData: {
		canRetrieveGlobalSku: true,
		hasGlobalSKU: true,
		hasGlobalIdentifier: true,
		hasVariants: false,
		productType: "simple",
	},
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: The keyphrase contains 2 content words. That's way " +
			"less than the recommended minimum of 4 content words. <a href='https://yoa.st/shopify11' target='_blank'>Make it longer</a>!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The keyphrase was found 4 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym " +
			"appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify16' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/shopify17' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 8,
		resultText: "<a href='https://yoa.st/shopify18' target='_blank'>Competing links</a>: There are no links which use your keyphrase or synonym as their anchor text. Nice!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 217 words. Good job!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in SEO title</a>: Does not contain the exact match. " +
			"<a href='https://yoa.st/shopify25' target='_blank'>Try to write the exact match of your keyphrase in the SEO title " +
			"and put it at the beginning of the title</a>.",
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
	productIdentifiers: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: Your product has an identifier. Good job!",
	},
	productSKU: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4lw' target='_blank'>SKU</a>: Your product has a SKU. Good job!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify22' target='_blank'>Keyphrase in image alt attributes</a>: Good job!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify20' target='_blank'>Images and videos</a>: Good job!",
	},
	imageAltTags: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify40' target='_blank'>Image alt attributes</a>: One image doesn't have alt attributes." +
			" <a href='https://yoa.st/shopify41' target='_blank'>Add alt attributes to your images</a>!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 1,
		resultText: "<a href='https://yoa.st/shopify30' target='_blank'>Keyphrase distribution</a>: Very uneven. Large parts of your text " +
			"do not contain the keyphrase or its synonyms. <a href='https://yoa.st/shopify31' target='_blank'>Distribute them more evenly</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain more than " +
			"the recommended maximum number of words (70). <a href='https://yoa.st/shopify67' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: 28.6% of the sentences contain more than 20 words, which is more than the recommended maximum of 20%. <a href='https://yoa.st/shopify49' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify42' target='_blank'>Passive voice</a>: You are not using too much passive voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	listPresence: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: No lists appear on this page. " +
			"<a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!",
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
