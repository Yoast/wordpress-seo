import Paper from "../../../../src/values/Paper.js";
import loadText from "../../../../src/helpers/loadFullTextPapers";

const language = "sv";
const name = "swedishPaper2";

const paper = new Paper( loadText( language, name ), {
	keyword: "tiger",
	synonyms: "panthera tigris",
	description: "Tiger (Panthera tigris) är ett kattdjur som endast lever i Asien. Tigern är det största nu levande kattdjuret. Man delar upp de idag förekommande bestånden i sex underarter. Utöver detta känner man till tre utdöda underarter.",
	title: "Tiger (panthera tigris)",
	titleWidth: 450,
	locale: "sv_SE",
	url: "https://sv.wikipedia.org/wiki/Tiger",
} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 2.1%. This is great!",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done! !",
	},
	metaDescriptionLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		score: 0,
		resultText: "",
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
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 808 words. Good job!",
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
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!",
	},
	urlLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!",
	},
	urlStopWords: {
		score: 0,
		resultText: "",
	},
	keyphraseDistribution: {
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
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
		score: 3,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 30.4% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
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

