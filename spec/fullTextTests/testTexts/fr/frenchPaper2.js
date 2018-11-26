import Paper from "../../../../src/values/Paper.js";
import content from "./frenchPaper2.html";

const name = "frenchPaper2";

const paper = new Paper( content, {
	keyword: "syntaxe (linguistique)",
	synonyms: "syntaxe",
	description: "La syntaxe est la branche de la linguistique qui étudie la façon dont les mots se combinent pour former des phrases ou des énoncés dans une langue.",
	title: "Syntaxe en linguistique",
	titleWidth: 450,
	locale: "fr_FR",
	permalink: "https://fr.wikipedia.org/wiki/syntaxe",
	url: "syntaxe",
} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 4,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.5%. This is too low; the keyphrase was found 4 times. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your subheadings</a>!",
	},
	textCompetingLinks: {
		score: 0,
		isApplicable: true,
		resultText: "",
	},
	textImages: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
	},
	textLength: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 845 words. Good job!",
	},
	externalLinks: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. <a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title</a>.",
	},
	titleWidth: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: (Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!",
	},
	urlLength: {
		score: 0,
		isApplicable: true,
		resultText: "",
	},
	urlStopWords: {
		score: 0,
		isApplicable: true,
		resultText: "",
	},
	keyphraseDistribution: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 75.7 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 35.2% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 20.6% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 17.5% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
	},
	textPresence: {
		score: 0,
		isApplicable: true,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: The text contains 3 consecutive sentences starting with the same word. <a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!",
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

