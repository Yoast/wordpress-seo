import Paper from "../../../../src/values/Paper.js";
import content from "./turkishPaper3.html";

const name = "turkishPaper3";

const paper = new Paper( content, {
	keyword: "Farsça",
	synonyms: "farsça",
	description: "Farsça (Farsça: فارسی ; Farsî veya زبان فارسی ; Zabân-e Fârsi), İran, Afganistan, Tacikistan, Özbekistan ve Basra Körfezi ülkelerinde konuşulan Hint-Avrupa dil ailesine mensup dildir. Hint-Avrupa dil ailesinin bir kolu olan Hint-İran dillerinin İran öbeğine bağlıdır. Antik Pers halkının konuştuğu dilden türemiştir.",
	title: "Farsça",
	titleWidth: 450,
	locale: "tr_TR",
	permalink: "https://tr.wikipedia.org/wiki/Fars%C3%A7a",
	url: "Farsça",
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
		score: -50,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 57 times. That's way more than the recommended maximum of 37 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
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
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 1117 words. Good job!",
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
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
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
		isApplicable: false,
		score: 3,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 33.1 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less difficult words to improve readability</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 19.1% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 12.7% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
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
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Images on this page do not have alt attributes with at least" +
			" half of the words from your keyphrase. <a href='https://yoa.st/4f6' target='_blank'>Fix that</a>!",
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
