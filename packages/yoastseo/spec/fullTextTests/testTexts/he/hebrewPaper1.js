import Paper from "../../../../src/values/Paper.js";
import content from "./hebrewPaper1.html";

const name = "hebrewPaper1";

const paper = new Paper( content, {
	keyword: "נאפולי",
	synonyms: "",
	description: "העיר היא עיר הבירה של פרובינציית נאפולי ובירת מחוז קמפניה. בנאפולי מתגוררים " +
		"כ-959,000 תושבים ובאזור המטרופוליטני, הכולל גם חלקים מנפות קזרטה, אבלינו וסלרנו מתגוררים כ-4,000,000 תושבים.",
	title: "נאפולי",
	titleWidth: 450,
	locale: "he_IL",
	permalink: "https://he.wikipedia.org/wiki/%D7%A0%D7%90%D7%A4%D7%95%D7%9C%D7%99",
	url: "%D7%A0%D7%90%D7%A4%D7%95%D7%9C%D7%99",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 6 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: " +
			"Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: " +
			"The meta description is over 156 characters. To ensure the entire description will be visible," +
			" you should reduce the length</a>!",
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
		resultText: "Text length</a>: The text contains 388 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "Outbound links</a>:" +
			" No outbound links appear in this page. Add some</a>!",
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
		score: 6,
		resultText: "Keyphrase in slug</a>: (Part of) your keyphrase does not appear in the slug. Change that</a>!",
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
		score: 6,
		resultText: "Keyphrase distribution</a>: " +
			"Uneven. Some parts of your text do not contain the keyphrase or its synonyms." +
			" Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "Subheading distribution</a>:" +
			" You are not using any subheadings, although your text is rather long." +
			" Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Paragraph length</a>: " +
			"1 of the paragraphs contains more than the recommended maximum of 150 words." +
			" Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "Sentence length</a>: 66.7% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%. Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "Passive voice</a>: 13.6% of the sentences contain passive voice, which is more than the recommended maximum of 10%. Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "Consecutive sentences</a>:" +
			" There is enough variety in your sentences. That's great!",
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
