import Paper from "../../../../src/values/Paper.js";
import content from "./russianPaper1.html";

const name = "russianPaper1";

const paper = new Paper( content, {
	keyword: "Роти-буайя",
	synonyms: "roti buaya",
	description: "Роти-буайя — блюдо индонезийской кухни, традиционный атрибут свадебного застолья в Джакарте и её окрестностях.",
	title: "Roti buaya",
	titleWidth: 450,
	locale: "ru_RU",
	permalink: "https://ru.wikipedia.org/wiki/Роти-буайя",
	url: "Роти-буайя",
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
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 14 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. <a href='https://yoa.st/34e' target='_blank'>Use the space</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textImages: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 743 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Not all the words from your keyphrase \"Роти-буайя\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!",
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
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 33.1 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less difficult words to improve readability</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 1 section of your text is longer than 300 words and is not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 39.1% of the sentences contain more than 15 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 15.7% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
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

