import Paper from "../../../../src/values/Paper.js";
import content from "./catalanPaper3.html";

const name = "catalanPaper3";

const paper = new Paper( content, {
	keyword: "Gat calicó",
	synonyms: "gat fagí",
	description: "Un gat calicó és un gat domèstic amb una coloració característica al pelatge. El seu pelatge està conformat " +
		"per tres colors diferents: és blanc amb taques ataronjades i negres. El gat calicó no és una raça de gat en concret, " +
		"sinó que és exclusivament una característica de la coloració del pèl que es pot trobar a diferents races.",
	title: "Gat calicó",
	titleWidth: 450,
	locale: "ca",
	permalink: "https://ca.wikipedia.org/wiki/Gat_calic%C3%B3",
	url: "Gat_calic%C3%B3",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase density</a>: " +
			"The focus keyphrase was found 8 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym " +
			"appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is over 156 characters. " +
			"To ensure the entire description will be visible, you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: " +
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
		resultText: "Text length</a>: The text contains 887 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 8,
		resultText: "Outbound links</a>: There are both nofollowed and normal " +
			"outbound links on this page. Good job!",
	},
	internalLinks: {
		isApplicable: true,
		score: 8,
		resultText: "Internal links</a>: There are both nofollowed and normal internal " +
			"links on this page. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase appears " +
			"at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase in slug</a>: (Part of) your keyphrase does " +
			"not appear in the slug. Change that</a>!",
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
		resultText: "Keyphrase distribution</a>: Very uneven. Large parts of your text " +
			"do not contain the keyphrase or its synonyms. Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: false,
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 6,
		resultText: "Subheading distribution</a>: 1 section of your text is longer than " +
			"300 words and is not separated by any subheadings. Add subheadings " +
			"to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Paragraph length</a>: 1 of the paragraphs contains more than " +
			"the recommended maximum of 150 words. Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "Transition words</a>: Only 3.5% of the sentences contain " +
			"transition words, which is not enough. Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: false,
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: false,
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 9,
		resultText: "Image Keyphrase</a>: Good job!",
	},
	imageCount: {
		isApplicable: true,
		score: 9,
		resultText: "Images</a>: Good job!",
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

