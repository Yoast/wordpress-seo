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
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. <a href='https://yoa.st/33f' target='_blank'>Fix that</a>!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 4 times for a text of this length." +
			" <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!",
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
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 1074 words. Good job!",
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
		score: 6,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. <a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: More than half of your keyphrase appears in the slug. That's great!",
	},
	urlLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!",
	},
	urlStopWords: {
		isApplicable: true,
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!",
	},
	keyphraseDistribution: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 67 in the test, which is considered ok to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>Try and add some subheadings</a>.",
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
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 27.4% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 14.7% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
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
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Image Keyphrase</a>: Images on this page do not have alt attributes that reflect" +
			" the topic of your text. <a href='https://yoa.st/4f6' target='_blank'>Add your keyphrase or synonyms to the alt tags of relevant images</a>!",
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
