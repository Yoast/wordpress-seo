import Paper from "../../../../src/values/Paper.js";
import content from "./germanPaper1.html";

const name = "germanPaper1";

const paper = new Paper( content, {
	keyword: "Flughafen London Heathrow",
	synonyms: "Heathrow airport",
	description: "Ein Artikel über den größten Flughafen von London, den größten in Europa und den sechstgrößten der Welt. Heathrow wurde 1946 eröffnet.",
	title: "Heathrow London airport",
	titleWidth: 450,
	locale: "de_DE",
	permalink: "https://de.wikipedia.org/wiki/Flughafen_London_Heathrow",
	url: "Flughafen_London_Heathrow",
} );

const expectedResults = {
	introductionKeyword: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0%. This is too low; the keyphrase was found 0 times. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: The meta description has been specified, but it does not contain the keyphrase. <a href='https://yoa.st/33l' target='_blank'>Fix that</a>!",
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
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!",
	},
	textLength: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 705 words. Good job!",
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
		score: 2,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Not all the words from your keyphrase \"Flughafen London Heathrow\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>Try to use the exact match of your keyphrase in the SEO title</a>.",
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
		score: 0,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: <a href='https://yoa.st/33u' target='_blank'>Include your keyphrase or its synonyms in the text so that we can check keyphrase distribution</a>.",
	},
	fleschReadingEase: {
		score: 3,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 47.8 in the test, which is considered difficult to read. Good job!",
	},
	subheadingsTooLong: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 1 section of your text is longer than 300 words and is not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 29.2% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 28.3% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		score: 6,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 15.1% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
	},
	textPresence: {
		score: 0,
		isApplicable: true,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 9,
		isApplicable: true,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
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

