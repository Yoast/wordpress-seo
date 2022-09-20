import Paper from "../../../../src/values/Paper.js";
import content from "./japanesePaper.html";

const name = "japanesePaper";

const paper = new Paper( content, {
	keyword: "完了形",
	synonyms: "",
	description: "完了形（かんりょうけい）とは、述語で表現される事象が、叙述中で基準となる時点で完了していることを表現する文法的形式。" +
		"英語の\"have＋過去分詞\"などが代表的である。",
	title: "完了形",
	titleWidth: 450,
	locale: "ja",
	permalink: "https://ja.wikipedia.org/wiki/%E5%AE%8C%E4%BA%86%E5%BD%A2",
	slug: "%E5%AE%8C%E4%BA%86%E5%BD%A2",
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
		score: 4,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 3 times. " +
			"That's less than the recommended minimum of 8 times for a text of this length. " +
			"<a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or synonym " +
			"appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 80 characters." +
			" To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n'" +
			" target='_blank'>Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
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
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 3165 characters. Good job!",
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
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in SEO title</a>: " +
			"The focus keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
		isApplicable: false,
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
		score: 1,
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Very uneven. " +
			"Large parts of your text do not contain the keyphrase or its synonyms. " +
			"<a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 characters and are not separated by any subheadings. " +
			"<a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 4 of the paragraphs contain more " +
			"than the recommended maximum of 300 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 50.8% of the sentences contain more than 40 characters, " +
			"which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
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
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: " +
			"The text contains 4 consecutive sentences starting with the same word. " +
			"<a href='https://yoa.st/35g' target='_blank'>Try to mix things up</a>!",
	},
	imageKeyphrase: {
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page. " +
			"<a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
	},
	wordComplexity: {
		isApplicable: false,
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
