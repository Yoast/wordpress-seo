import Paper from "../../../../src/values/Paper.js";
import content from "./russianPaper2.html";

const name = "russianPaper2";

const paper = new Paper( content, {
	keyword: "Ядерные тельца",
	synonyms: "nuclear bodies",
	description: "субкомпартменты внутри ядра, не окружённые мембранами, но представляющие собой отдельные, морфологически различимые комплексы белков и РНК.",
	title: "Ядерные тельца",
	titleWidth: 450,
	locale: "ru_RU",
	permalink: "https://ru.wikipedia.org/wiki/Ядерные-тельца",
	url: "Ядерные-тельца",
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
			"The focus keyphrase was found 9 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in meta description</a>: The meta description has been specified, but it does not contain the keyphrase. Fix that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "Meta description length</a>: Well done!",
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
		resultText: "Text length</a>: The text contains 545 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Outbound links</a>: Good job!",
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
		isApplicable: true,
		score: 3,
		resultText: "Flesch Reading Ease</a>: The copy scores 30.8 in the test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "Subheading distribution</a>: You are not using any subheadings, although your text is rather long. Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words. Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "Sentence length</a>: 47.4% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%. Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 6,
		resultText: "Transition words</a>: Only 25.5% of the sentences contain transition words, which is not enough. Use more of them</a>.",
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

