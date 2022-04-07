import Paper from "../../../../src/values/Paper.js";
import content from "./greekPaper.html";

const name = "greekPaper";

const paper = new Paper( content, {
	keyword: "Ελληνική γλώσσα",
	synonyms: "",
	description: "Με τον όρο αρχαία ελληνική γλώσσα εννοείται μια μορφή της ελληνικής γλώσσας που ομιλείτο κατά τους αρχαϊκούς" +
		" χρόνους και την κλασική αρχαιότητα.",
	title: "Ελληνική γλώσσα",
	titleWidth: 450,
	locale: "el",
	permalink: "https://el.wikipedia.org/wiki/%CE%95%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AE_%CE%B3%CE%BB%CF%8E%CF%83%CF%83%CE%B1",
	slug: "%CE%95%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AE_%CE%B3%CE%BB%CF%8E%CF%83%CF%83%CE%B1",
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
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 37 times. This is great!",
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
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n'" +
			" target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/34l' target='_blank'>Link keyphrase</a>: You're linking to another page with " +
			"the words you want this page to rank for. <a href='https://yoa.st/34m' target='_blank'>Don't do that</a>!",
	},
	textImages: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page." +
			" <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 2912 words. Good job!",
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
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase" +
			" appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: (Part of) your keyphrase does not" +
			" appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!",
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
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 1 section of your text is longer" +
			" than 300 words and is not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings" +
			" to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 15.9% of the sentences contain" +
			" transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 20.9% of the sentences contain passive voice," +
			" which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>" +
			"Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences." +
			" That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Images on this page do not have alt attributes " +
			"with at least half of the words from your keyphrase. <a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: Good job!",
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
