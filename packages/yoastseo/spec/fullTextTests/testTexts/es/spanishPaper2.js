import Paper from "../../../../src/values/Paper.js";
import content from "./spanishPaper2.html";

const name = "spanishPaper2";

const paper = new Paper( content, {
	keyword: "Signo de puntuación",
	synonyms: "Signos como: .,;",
	description: "Los principales signos de puntuación son el punto (.), la coma (,), el punto y coma (;), las comillas, los paréntesis, los signos de interrogación, los signos de exclamación, los puntos suspensivos y el guion.",
	title: "Puntuación",
	titleWidth: 450,
	locale: "es_ES",
	permalink: "https://es.wikipedia.org/wiki/Signo_de_puntuación",
	url: "Signo-de-puntuación",
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
		resultText: "Keyphrase density</a>: The focus keyphrase was found 5 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in meta description</a>: The meta description contains the keyphrase 3 times, which is over the advised maximum of 2 times. Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in subheading</a>: " +
			"2 of your H2 and H3 subheadings reflect the topic of your copy. Good job!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 914 words. Good job!",
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
		score: 2,
		resultText: "Keyphrase in title</a>: Not all the words from your keyphrase \"Signo de puntuación\" appear in the SEO title. For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title</a>.",
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
		resultText: "Flesch Reading Ease</a>: The copy scores 73.5 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Subheading distribution</a>: 1 section of your text is longer than 300 words and is not separated by any subheadings. Add subheadings to improve readability</a>.",
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
		score: 6,
		resultText: "Transition words</a>: Only 20.2% of the sentences contain transition words, which is not enough. Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 3,
		resultText: "Consecutive sentences</a>: The text contains 2 instances where 3 or more consecutive sentences start with the same word. Try to mix things up</a>!",
	},
	imageKeyphrase: {
		// This is not applicable to this paper since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "Images</a>: No images appear on this page. <a href='https://yoa.st/4f5'" +
			" target='_blank'>Add some</a>!",
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

