import Paper from "../../../../src/values/Paper";
import content from "./englishPaper4.html";

const name = "englishPaper4";

const paper = new Paper( content, {
	keyword: "open source opportunities",
	synonyms: "open source contribution, wordpress contribute, contribute to open source",
	description: "You don't need to be a developer to contribute to WordPress! Carole Olinger explains why she believes all contributors are heros.",
	title: "Open source: reducing boundaries and creating opportunities",
	titleWidth: 450,
	locale: "en_EN",
	permalink: "https://yoast.com/open-source-reducing-boundaries-and-creating-opportunities/",
	url: "open-source-reducing-boundaries-and-creating-opportunities",
} );

const expectedResults = {
	introductionKeyword: {
		score: 6,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>:Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!",
	},
	keyphraseLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 4,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.1%. This is too low; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
	},
	subheadingsKeyword: {
		score: 6,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keyphrases or synonyms in your subheadings</a>!",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 6,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: Images on this page do not have alt attributes with words from your keyphrase. <a href='https://yoa.st/33d' target='_blank'>Fix that</a>!",
	},
	textLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 1074 words. Good job!",
	},
	externalLinks: {
		score: 6,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		score: 6,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. <a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title</a>.",
	},
	titleWidth: {
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: More than half of your keyphrase appears in the slug. That's great!",
	},
	urlLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!",
	},
	urlStopWords: {
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!",
	},
	keyphraseDistribution: {
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 67.1 in the test, which is considered ok to read. Good job!",
	},
	subheadingsTooLong: {
		score: 2,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 27.1% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		score: 6,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 14.6% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
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
