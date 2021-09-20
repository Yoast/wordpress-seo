import Paper from "../../../../src/values/Paper.js";
import content from "./catalanPaper1.html";

const name = "catalanPaper1";

const paper = new Paper( content, {
	keyword: "Clàssic",
	synonyms: "",
	description: "El terme clàssic fa referència a un conjunt difús i alhora ampli de conceptes estètics que abracen la majoria " +
		"de disciplines artístiques considerades canòniques. El significat és variable segons el país o l'època. Aquest conjunt " +
		"té sentit en comparació a moviments estètics més recents.",
	title: "Clàssic",
	titleWidth: 450,
	locale: "ca",
	permalink: "https://ca.wikipedia.org/wiki/Cl%C3%A0ssic",
	url: "Clàssic",
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
		resultText: "Keyphrase density</a>: " +
			"The focus keyphrase was found 10 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear " +
			"in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is over 156 characters. " +
			"To ensure the entire description will be visible, you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: " +
			"Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 770 words. Good job!",
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
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase appears " +
			"at the beginning of the SEO title. Good job!",
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
		score: 6,
		resultText: "Keyphrase distribution</a>: Uneven. Some parts of your text " +
			"do not contain the keyphrase or its synonyms. Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Subheading distribution</a>: 1 section of your text is longer than " +
			"300 words and is not separated by any subheadings. Add subheadings " +
			"to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "Paragraph length</a>: 1 of the paragraphs contains more than " +
			"the recommended maximum of 150 words. Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "Transition words</a>: Only 12.1% of the sentences contain transition words, " +
			"which is not enough. Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: false,
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: false,
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "Image Keyphrase</a>: Images on this page do not have alt attributes that reflect" +
			" the topic of your text. Add your keyphrase or synonyms to the alt tags of relevant images</a>!",
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

