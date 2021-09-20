import Paper from "../../../../src/values/Paper.js";
import content from "./dutchPaper1.html";

const name = "dutchPaper1";

const paper = new Paper( content, {
	keyword: "schaap",
	synonyms: "Ovis orientalis aries",
	description: "Het schaap (Ovis orientalis aries) is een evenhoevig zoogdier.",
	title: "Schaap (dier)",
	titleWidth: 450,
	locale: "nl_NL",
	permalink: "https://nl.wikipedia.org/wiki/Schaap_(dier)",
	url: "Schaap_(dier)",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in introduction</a>: Your keyphrase or its synonyms do not appear in the first paragraph. Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: -10,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 20 times. That's more than the recommended maximum of 18 times for a text of this length. Don't overoptimize</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. Use the space</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 2,
		resultText: "Link keyphrase</a>: You're linking to another page with the words you want this page to rank for. Don't do that</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 541 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "Outbound links</a>: No outbound links appear in this page. Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in slug</a>: Great work!",
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
		resultText: "Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 9,
		resultText: "Flesch Reading Ease</a>: The copy scores 61.7 in the test, which is considered ok to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "Passive voice</a>: 14.6% of the sentences contain passive voice, which is more than the recommended maximum of 10%. Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
	imageKeyphrase: {
		// This is not applicable to this paper since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "Images</a>: No images appear on this page." +
			" Add some</a>!",
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
