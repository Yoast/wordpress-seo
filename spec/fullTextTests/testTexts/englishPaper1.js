import Paper from "../../../src/values/Paper.js";
import loadText from "../../../src/helpers/loadFullTextPapers";

const language = "en";
const name = "englishPaper1";

const paper = new Paper( loadText( language, name ), {
	keyword: "voice search",
	synonyms: "listening and reading in search, voice query, voice results",
	description: "Voice search is gaining popularity. But what will the future bring? Joost and Marieke discuss the pros and cons of voice and describe a possible future scenario.",
	title: "Voice search: what will the future bring?",
	titleWidth: 450,
	locale: "en_EN",
	url: "https://yoast.com/future-of-voice-search/",
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
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 1.5%. This is great!",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: 2 (out of 4) subheadings reflect the topic of your copy. Good job!",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 3,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
	},
	textLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 716 words. Good job!",
	},
	externalLinks: {
		score: 9,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!",
	},
	internalLinks: {
		score: 3,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: No internal links appear in this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!",
	},
	titleKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the keyphrase appears at the beginning of the SEO title. Good job!",
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
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!",
	},
	keyphraseDistribution: {
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 78.7 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		score: 3,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words." +
		" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 28.6% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
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
