import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper3.html";

const name = "englishPaper3";

const paper = new Paper( content, {
	keyword: "birch milk refinng toner",
	synonyms: "hydrating toner",
	description: "*For a limited time only, receive a complimentary Living Cleansing Balm Travel Mini with every purchase of " +
		"the Birch Milk Refining Toner to help you on your acne journey. Exclusions apply* The Birch Milk Refining Toner is more " +
		"than just a hydrating toner. Its gentle-yet-effective formulation helps to prevent breakouts",
	title: "Birch milk refinng toner",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://thenimetyou.com/products/birch-milk-refining-toner",
	url: "birch-milk-refining-toner",
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
		score: 9,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 0 times. " +
			"That's less than the recommended minimum of 9 times for a text of this length. <a href='https://yoa.st/shopify13' target='_blank'>" +
			"Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym " +
			"appear in the meta description. Well done!",
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
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 3402 words. Good job!",
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
		resultText: "<a href='https://yoa.st/shopify22' target='_blank'>Image Keyphrase</a>: Out of 30 images on this page, " +
			"only 8 have alt attributes that reflect the topic of your text. <a href='https://yoa.st/shopify23' target='_blank'>" +
			"Add your keyphrase or synonyms to the alt tags of more relevant images</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify20' target='_blank'>Images and videos</a>: Good job!",
	},
	imageAltTags: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify40' target='_blank'>Image alt tags</a>: 5 images out of 30 don't have alt attributes." +
			" <a href='https://yoa.st/shopify41' target='_blank'>Add alt attributes to your images</a>!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: 3 sections of your text are longer " +
			"than 300 words and are not separated by any subheadings. <a href='https://yoa.st/shopify69' target='_blank'>" +
			"Add subheadings to improve readability</a>.",
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
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Only 2.2% of the sentences contain " +
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
