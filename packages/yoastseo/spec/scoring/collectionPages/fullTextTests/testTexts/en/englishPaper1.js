import Paper from "../../../../../../src/values/Paper.js";
import content from "./englishPaper1.html";

const name = "englishPaper1";

const paper = new Paper( content, {
	keyword: "koleksi batik",
	synonyms: "batik",
	description: "Batik is a technique of wax-resist dyeing applied to the whole cloth, or cloth made using this technique. " +
		"Of Javanese origin, batik is made either by drawing dots and lines of the resist with a spouted tool called a " +
		"canting, or by printing the resist with a copper stamp called a cap. ",
	title: "Koleksi Batik",
	titleWidth: 450,
	locale: "en_US",
	permalink: "https://en.wikipedia.org/wiki/Batik",
	slug: "Batik",
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
		score: 4,
		resultText: "<a href='https://yoa.st/shopify12' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 0 times. " +
			"That's less than the recommended minimum of 2 times for a text of this length. <a href='https://yoa.st/shopify13'" +
			" target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify14' target='_blank'>Keyphrase in meta description</a>: Keyphrase or" +
			" synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify46' target='_blank'>Meta description length</a>: The meta description is over 156 characters." +
			" To ensure the entire description will be visible, <a href='https://yoa.st/shopify47' target='_blank'>you should reduce the length</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify58' target='_blank'>Text length</a>: The text contains 260 words. Good job!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify24' target='_blank'>Keyphrase in SEO title</a>: The exact match of the focus " +
			"keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/shopify52' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify26' target='_blank'>Keyphrase in slug</a>: (Part of) your keyphrase" +
			" does not appear in the slug. <a href='https://yoa.st/shopify27' target='_blank'>Change that</a>!",
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
		score: 3,
		resultText: "<a href='https://yoa.st/shopify48' target='_blank'>Sentence length</a>: 50% of the sentences contain more " +
			"than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/shopify49' target='_blank'>" +
			"Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify44' target='_blank'>Transition words</a>: Only 20% of the sentences contain " +
			"transition words, which is not enough. <a href='https://yoa.st/shopify45' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/shopify42' target='_blank'>Passive voice</a>: 26.7% of the sentences contain passive voice, " +
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
		resultText: "<a href='https://yoa.st/shopify5' target='_blank'>Consecutive sentences</a>: There is enough " +
			"variety in your sentences. That's great!",
	},
	wordComplexity: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/shopify77' target='_blank'>Word complexity</a>: 10.38% of the words in your text is considered complex." +
			" <a href='https://yoa.st/shopify78' target='_blank'>Try to use shorter and more familiar words to improve readability</a>.",
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
