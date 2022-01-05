import Paper from "../../../../src/values/Paper.js";
import content from "./catalanPaper2.html";

const name = "catalanPaper2";

const paper = new Paper( content, {
	keyword: "Gat salvatge",
	synonyms: "gat fagí",
	description: "El gat salvatge, gat fer, gat fagí, gat vaire, gat feréstec o gat bornaix (Felis silvestris) també conegut " +
		"com a gat salvatge euroasiàtic, és una espècie de mamífer carnívor salvatge de la família dels fèlids que habita Euràsia i Àfrica.",
	title: "Gat salvatge - Viquipèdia, l'enciclopèdia lliure",
	titleWidth: 450,
	locale: "ca",
	permalink: "https://ca.wikipedia.org/wiki/Gat_salvatge",
	url: "Gat_salvatge",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms " +
			"do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure the topic is clear immediately</a>.",
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
			"The focus keyphrase was found 5 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: The meta description contains " +
			"the keyphrase 4 times, which is over the advised maximum of 2 times. <a href='https://yoa.st/33l' target='_blank'>Limit that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. " +
			"To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>" +
			"Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 748 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. " +
			"<a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus keyphrase appears " +
			"at the beginning of the SEO title. Good job!",
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
		score: 6,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. Some parts of your text " +
			"do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: 1 section of your text is longer than " +
			"300 words and is not separated by any subheadings. <a href='https://yoa.st/34y' target='_blank'>Add subheadings " +
			"to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than " +
			"the recommended maximum of 150 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 21.1% of the sentences contain transition words, " +
			"which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: false,
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: false,
	},
	imageKeyphrase: {
		// This is not applicable to this paper since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page. " +
			"<a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
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

