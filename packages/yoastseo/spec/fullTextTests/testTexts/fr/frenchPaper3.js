import Paper from "../../../../src/values/Paper.js";
import content from "./frenchPaper3.html";

const name = "frenchPaper3";

const paper = new Paper( content, {
	keyword: "contexte du mouvement des gilets jaunes",
	synonyms: "gilets jaunes",
	description: "Le contexte d'un mouvement de protestation non structuré apparu en France en 2018",
	title: "mouvement des gilets jaunes (contexte)",
	titleWidth: 450,
	locale: "fr_FR",
	permalink: "https://fr.wikipedia.org/wiki/Mouvement_des_gilets_jaunes",
	url: "Mouvement_des_gilets_jaunes",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in introduction</a>: Your keyphrase or its synonyms do not appear in the first paragraph. Make sure the topic is clear immediately</a>.",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "Keyphrase density</a>: The focus keyphrase was found 0 times. That's less than the recommended minimum of 2 times for a text of this length. Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in meta description</a>: The meta description has been specified, but it does not contain the keyphrase. Fix that</a>!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. Use the space</a>!",
	},
	subheadingsKeyword: {
		isApplicable: true,
		score: 3,
		resultText: "Keyphrase in subheading</a>: Use more keyphrases or synonyms in your H2 and H3 subheadings</a>!",
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "Text length</a>: The text contains 782 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "Outbound links</a>: No outbound links appear in this page. Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase in title</a>: Does not contain the exact match. Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in slug</a>: More than half of your keyphrase appears in the slug. That's great!",
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
		score: 0,
		resultText: "Keyphrase distribution</a>: Include your keyphrase or its synonyms in the text so that we can check keyphrase distribution</a>.",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 9,
		resultText: "Flesch Reading Ease</a>: The copy scores 75.4 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Subheading distribution</a>: 2 sections of your text are longer than 300 words and are not separated by any subheadings. Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Paragraph length</a>: 2 of the paragraphs contain more than the recommended maximum of 150 words. Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "Transition words</a>: Only 14.5% of the sentences contain transition words, which is not enough. Use more of them</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 6,
		resultText: "Passive voice</a>: 11.6% of the sentences contain passive voice, which is more than the recommended maximum of 10%. Try to use their active counterparts</a>.",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 3,
		resultText: "Consecutive sentences</a>: The text contains 3 consecutive sentences starting with the same word. Try to mix things up</a>!",
	},
	imageKeyphrase: {
		// This is not applicable to this paper since the text doesn't have any image in it.
		isApplicable: false,
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "Images</a>: No images appear on this page. " +
			"Add some</a>!",
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

