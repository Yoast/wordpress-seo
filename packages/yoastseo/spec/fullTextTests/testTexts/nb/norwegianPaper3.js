import Paper from "../../../../src/values/Paper.js";
import content from "./norwegianPaper3.html";

const name = "norwegianPaper3";

const paper = new Paper( content, {
	keyword: "Tamkatt",
	synonyms: "huskatt",
	description: "Tamkatt eller huskatt (Felis silvestris catus) er et lite rovpattedyr i kattefamilien. Det er av mange også kjent " +
		"som katt, pus, pusekatt og kattepus. Vitenskapelig har tamkatten også blitt kalt F. s. domesticus.",
	title: "Tamkatt",
	titleWidth: 450,
	locale: "nb_NO",
	permalink: "https://no.wikipedia.org/wiki/Tamkatt",
	url: "Tamkatt",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in introduction</a>: Your keyphrase or its synonyms " +
			"do not appear in the first paragraph. Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase density</a>: " +
			"The focus keyphrase was found 38 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in meta description</a>: The meta description contains " +
			"the keyphrase 3 times, which is over the advised maximum of 2 times. Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is " +
			"over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' " +
			"target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: <a href='https://yoa.st/33n' " +
			"target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 4358 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "Outbound links</a>: No outbound links appear in this page. " +
			"Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase " +
			"appears at the beginning of the SEO title. Good job!",
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
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Subheading distribution</a>: 4 sections of your text are " +
			"longer than 300 words and are not separated by any subheadings. " +
			"Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Paragraph length</a>: 3 of the paragraphs contain more than " +
			"the recommended maximum of 150 words. Shorten your paragraphs</a>!",
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
		score: 9,
		resultText: "Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 3,
		resultText: "Consecutive sentences</a>: The text contains 3 consecutive " +
			"sentences starting with the same word. Try to mix things up</a>!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "Image Keyphrase</a>: Images on this page do not have alt attributes with at" +
			" least half of the words from your keyphrase. Fix that</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "Images</a>: Good job!",
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

