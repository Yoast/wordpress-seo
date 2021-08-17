import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper2.html";

const name = "englishPaper2";

const paper = new Paper( content, {
	keyword: "clarifying face mask",
	synonyms: "revitalizing blend for healthy skin",
	description: "Achieve youthful, radiant skin, clear acne and blemishes, minimize pores, brighten and soften skin with honey, " +
		"camu camu, coconut milk, lavender, cacao and neem.",
	title: "Illuminate Clarifying Face Mask",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://beneathyourmask.com/collections/our-collection/products/clarifying-face-mask",
	url: "clarifying-face-mask",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its " +
			"synonyms do not appear in the first paragraph. <a href='https://yoa.st/shopify9' target='_blank'>Make sure the topic " +
			"is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: The keyphrase is 3 words long. That's slightly" +
			" shorter than the recommended minimum of 4 words. <a href='https://yoa.st/shopify11' target='_blank'>Make it longer</a>!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was" +
			"found 123 times. This is great!",
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
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is " +
			"over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' " +
			"target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify16' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/shopify17'" +
			" target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 4712 words. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in title</a>: The exact match of the " +
			"focus keyphrase appears in the SEO title, but not at the beginning. <a href='https://yoa.st/shopify25' target='_blank'>" +
			"Move it to the beginning for the best results</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify52' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify26' target='_blank'>Keyphrase in slug</a>: More than half of your keyphrase " +
			"appears in the slug. That's great!",
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
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify22' target='_blank'>Image Keyphrase</a>: Out of 21 images on this page, " +
			"only 5 have alt attributes that reflect the topic of your text. <a href='https://yoa.st/shopify23' target='_blank'>" +
			"Add your keyphrase or synonyms to the alt tags of more relevant images</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify20' target='_blank'>Images and videos</a>: Good job!",
	},
	imageAltTags: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify40' target='_blank'>Image alt tags</a>: All images have alt attributes. Good job!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: 4 sections of your text " +
			"are longer than 300 words and are not separated by any subheadings. <a href='https://yoa.st/shopify69' target='_blank'>" +
			"Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains " +
			"more than the recommended maximum of 70 words. <a href='https://yoa.st/shopify67' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Only 1.8% of the sentences contain " +
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
	listPresence: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: No lists appear on this page. " +
			"<a href='https://yoa.st/shopify39' target='_blank'>Add at least one ordered or unordered list</a>!",
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
