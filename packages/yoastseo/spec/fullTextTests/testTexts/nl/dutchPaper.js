import Paper from "../../../../src/values/Paper.js";
import content from "./dutchPaper.html";

const name = "dutchPaper";

const paper = new Paper( content, {
	keyword: "schaap",
	synonyms: "Ovis orientalis aries",
	description: "Het schaap (Ovis orientalis aries) is een evenhoevig zoogdier.",
	title: "Schaap (dier)",
	titleWidth: 450,
	textTitle: "Schaap (dier)",
	locale: "nl_NL",
	permalink: "https://nl.wikipedia.org/wiki/Schaap_(dier)",
	slug: "Schaap_(dier)",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: -10,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The keyphrase was found 20 times. That's more than the recommended maximum of 18 times for a text of this length. " +
			"<a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is too short (under 120 characters). Up to 156 characters are available. " +
			"<a href='https://yoa.st/34e' target='_blank'>Use the space</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: " +
			"<a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 8,
		resultText: "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: There are no links which use your keyphrase or synonym as their anchor text. Nice!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 541 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: " +
			"No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in SEO title</a>: " +
			"The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!",
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
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: There are no paragraphs that are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: " +
			"18.4% of the sentences contain passive voice, which is more than the recommended maximum of 10%. " +
			"<a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"There are no repetitive sentence beginnings. That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Keyphrase in image alt attributes</a>: This page does not have images, a keyphrase, or both. <a href='https://yoa.st/4f6' target='_blank'>Add some images with alt attributes that include the keyphrase or synonyms</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page." +
			" <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
	},
	wordComplexity: {
		isApplicable: false,
	},
	textAlignment: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textTitleAssessment: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4nh' target='_blank'>Title</a>: Your page has a title. Well done!",
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
