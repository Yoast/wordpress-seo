import Paper from "../../../../src/values/Paper.js";
import content from "./slovakPaper3.html";

const name = "slovakPaper3";

const paper = new Paper( content, {
	keyword: "Európska mačka",
	synonyms: "kočky plavé",
	description: "Európska krátkosrstá mačka vznikla prirodzenou cestou z domestikovanej mačky bez uplatňovania špeciálnych chovných " +
		"pravidiel a postupov. Plemeno sa chová hlavne v škandinávskych krajinách a najmä vo Fínsku sa radí medzi najobľúbenejšie " +
		"krátkosrsté plemená.",
	title: "Európska mačka",
	titleWidth: 450,
	locale: "sk_SK",
	permalink: "https://sk.wikipedia.org/wiki/Eur%C3%B3pska_ma%C4%8Dka",
	url: "Eur%C3%B3pska_ma%C4%8Dka",
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
		resultText: "Keyphrase density</a>: The focus keyphrase was found 15 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is over 156 characters." +
			" To ensure the entire description will be visible, you should reduce the length</a>!",
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
		resultText: "Text length</a>: The text contains 978 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 8,
		resultText: "Outbound links</a>: There are both nofollowed and normal outbound links on this page. Good job!",
	},
	internalLinks: {
		isApplicable: true,
		score: 8,
		resultText: "Internal links</a>: There are both nofollowed and normal internal links on this page. Good job!",
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
		score: 6,
		resultText: "Keyphrase in slug</a>: (Part of) your keyphrase does not " +
			"appear in the slug. Change that</a>!",
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
		resultText: "Keyphrase distribution</a>: Uneven. Some parts of your text do not contain the" +
			" keyphrase or its synonyms. Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
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
		score: 3,
		resultText: "Transition words</a>: Only 4.9% of the sentences contain transition words," +
			" which is not enough. Use more of them</a>.",
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
		resultText: "Consecutive sentences</a>: The text contains 3 consecutive sentences starting with" +
			" the same word. Try to mix things up</a>!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "Image Keyphrase</a>: Images on this page do not have alt attributes with at least" +
			" half of the words from your keyphrase. Fix that</a>!",
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

