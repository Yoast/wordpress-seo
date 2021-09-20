import Paper from "../../../../src/values/Paper.js";
import content from "./turkishPaper1.html";

const name = "turkishPaper1";

const paper = new Paper( content, {
	keyword: "Nektar",
	synonyms: "nektar",
	description: "Nektar, çiçeklerin ürettiği, şekerce zengin, böcek ve kuş benzeri tozlaşmaya yardımcı hayvanları kendine çeken salgıdır.",
	title: "Nektar",
	titleWidth: 450,
	locale: "tr_TR",
	permalink: "https://tr.wikipedia.org/wiki/Nektar",
	url: "Nektar",
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
		score: -50,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 5 times. That's way more than the recommended maximum of 3 times for a text of this length. Don't overoptimize</a>!",
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
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: -10,
		resultText: "Text length</a>: The text contains 112 words. This is far below the recommended minimum of 300 words. Add more content</a>.",
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
		score: 6,
		resultText: "Keyphrase distribution</a>: Uneven. Some parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
		score: 3,
		resultText: "Flesch Reading Ease</a>: The copy scores 33.1 in the test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability</a>.",
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
		// This assessment is not applicable to this paper as the text contains less than 200 words.
		isApplicable: false,
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
		score: 9,
		resultText: "Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
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
