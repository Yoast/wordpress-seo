import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper1.html";

const name = "englishPaper1";

const paper = new Paper( content, {
	keyword: "Resurfacing facial mask",
	synonyms: "facial treatment",
	description: "A 15 minute at-home Sparkling Facial treatment infused with our signature 6% AHA | 0.5% BHA Rose Complex and " +
		"ultra-nourishing ingredients like resveratrol and Damask Rose petals to resurface and brighten your complexion " +
		"without compromising your skin barrier.",
	title: "Rosé resurfacing facial mask",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://thenimetyou.com/products/rose-resurfacing-facial-mask",
	url: "rose-resurfacing-facial-mask",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify8' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: The keyphrase is 3 words long. " +
			"That's slightly shorter than the recommended minimum of 4 words. <a href='https://yoa.st/shopify11' target='_blank'>Make it longer</a>!",
	},
	keywordDensity: {
		isApplicable: true,
		score: -50,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 7 times. " +
			"That's way more than the recommended maximum of 3 times for a text of this length. <a href='https://yoa.st/shopify13' " +
			"target='_blank'>Don't overoptimize</a>!",
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
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is over 156 characters." +
			" To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: false,
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 158 words. This is slightly" +
			" below the recommended minimum of 200 words. <a href='https://yoa.st/shopify59' target='_blank'>Add a bit more copy</a>.",
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
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify22' target='_blank'>Image Keyphrase</a>: Out of 6 images on this page, 6 have alt attributes" +
			" with words from your keyphrase or synonyms. That's a bit much. <a href='https://yoa.st/shopify23' target='_blank'>" +
			"Only include the keyphrase or its synonyms when it really fits the image</a>.",
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
		score: 6,
		resultText: "<a href='https://yoa.st/shopify30' target='_blank'>Keyphrase distribution</a>: Uneven. Some parts of your text " +
			"do not contain the keyphrase or its synonyms. <a href='https://yoa.st/shopify31' target='_blank'>Distribute them more evenly</a>.",
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
