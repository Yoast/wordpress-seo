import Paper from "../../../../src/values/Paper.js";
import content from "./czechPaper.html";

const name = "czechPaper";

const paper = new Paper( content, {
	keyword: "Nikifor Černigovskij",
	synonyms: "Nikifor Romanovič Černigovskij",
	description: "Nikifor Romanovič Černigovskij (rusky Никифор Романович Черниговский; † 1675) byl ruský sibiřský kozák, " +
		"původem z polsko-litevského státu.",
	textTitle: "Nikifor Černigovskij",
	title: "Nikifor Černigovskij",
	titleWidth: 450,
	locale: "cs_CZ",
	permalink: "https://cs.wikipedia.org/wiki/Nikifor_%C4%8Cernigovskij",
	slug: "Nikifor_%C4%8Cernigovskij",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its " +
			"synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure the topic " +
			"is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The keyphrase was found 9 times. " +
			"That's less than the recommended minimum of 13 times for a text of this length. <a href='https://yoa.st/33w' " +
			"target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym " +
			"appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 8,
		resultText: "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: There are no links which use your keyphrase or synonym as their anchor text. Nice!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 3316 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in SEO title</a>: The exact match of the focus keyphrase " +
			"appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: (Part of) your keyphrase does not appear in the slug. " +
			"<a href='https://yoa.st/33p' target='_blank'>Change that</a>!",
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
		score: 1,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Very uneven. Large parts of your " +
			"text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 4 sections of your text are " +
			"longer than the recommended number of words (300) and are not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add " +
			"subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 5 of the paragraphs contain more than the " +
			"recommended maximum number of words (150). <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
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
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You are not using too much passive voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There are no repetitive sentence beginnings. That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Keyphrase in image alt attributes</a>: Images on this page do not have alt attributes with at least" +
			" half of the words from your keyphrase. <a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!",
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

