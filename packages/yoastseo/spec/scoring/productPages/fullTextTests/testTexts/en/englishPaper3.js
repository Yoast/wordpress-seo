import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper3.html";

const name = "englishPaper3";

const paper = new Paper( content, {
	keyword: "cat tree",
	synonyms: "tree house",
	description: "Cat trees vary in height and complexity, with most cats preferring features offering height[1] " +
		"over comfort, particularly if tall enough to allow a clear survey of their territory. " +
		"Some cats prefer options which offer shelter or a secluded escape,[1] which may be at any height of the structure.",
	title: "Cat tree house",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://en.wikipedia.org/wiki/Cat_tree",
	slug: "Cat_tree",
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
		resultText: "<a href='https://yoa.st/shopify10' target='_blank'>Keyphrase length</a>: The keyphrase contains 2 content words. " +
			"That's way less than the recommended minimum of 4 content words. <a href='https://yoa.st/shopify11' target='_blank'>Make it longer</a>!",
	},
	keywordDensity: {
		isApplicable: true,
		score: -50,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 11 times. " +
			"That's way more than the recommended maximum of 8 times for a text of this length. <a href='https://yoa.st/shopify13' " +
			"target='_blank'>Don't overoptimize</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear " +
			"in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is " +
			"over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' " +
			"target='_blank'>you should reduce the length</a>!",
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
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 345 words. Good job!",
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
		score: 0,
		resultText: "",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify22' target='_blank'>Image Keyphrase</a>: Good job!",
	},
	imageCount: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify20' target='_blank'>Images and videos</a>: Only 2 images or videos " +
			"appear on this page. We recommend at least 4. <a href='https://yoa.st/shopify21' target='_blank'>" +
			"Add more relevant images or videos</a>!",
	},
	imageAltTags: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify40' target='_blank'>Image alt tags</a>: All images have alt attributes. Good job!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify30' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/shopify68' target='_blank'>Subheading distribution</a>: You are not using any " +
			"subheadings, although your text is rather long. <a href='https://yoa.st/shopify69' target='_blank'>Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify66' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains " +
			"more than the recommended maximum of 70 words. <a href='https://yoa.st/shopify67' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: 41.2% of the sentences contain " +
			"more than 20 words, which is more than the recommended maximum of 20%. <a href='https://yoa.st/shopify49' target='_blank'>" +
			"Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify42' target='_blank'>Passive voice</a>: 21.1% of the sentences contain passive voice, " +
			"which is more than the recommended maximum of 10%. <a href='https://yoa.st/shopify43' target='_blank'>" +
			"Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	listPresence: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify38' target='_blank'>Lists</a>: There is at least one list on this page. Great!",
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
