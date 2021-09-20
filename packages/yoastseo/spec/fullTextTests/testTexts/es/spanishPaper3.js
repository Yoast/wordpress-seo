import Paper from "../../../../src/values/Paper.js";
import content from "./spanishPaper3.html";

const name = "spanishPaper3";

const paper = new Paper( content, {
	keyword: "El lugar de culto religioso más antiguo del mundo",
	synonyms: "Göbekli Tepe",
	description: "Göbekli Tepe (en turco, Colina panzuda) es un antiguo santuario",
	title: "Göbekli Tepe - un antiguo santuario",
	titleWidth: 450,
	locale: "es_ES",
	permalink: "https://es.wikipedia.org/wiki/Göbekli-Tepe",
	url: "Göbekli-Tepe",
} );

const expectedResults = {
	introductionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase length</a>: The keyphrase is 5 words long. That's more than the recommended maximum of 4 words. Make it shorter</a>!",
	},
	keywordDensity: {
		isApplicable: true,
		score: 4,
		resultText: "Keyphrase density</a>: " +
			"The focus keyphrase was found 1 time. That's less than the recommended minimum of 2 times for a text of this length. " +
			"Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "Meta description length</a>: The meta description is too short (under 120 characters). Up to 156 characters are available. Use the space</a>!",
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
		resultText: "Text length</a>: The text contains 526 words. Good job!",
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
		score: 2,
		resultText: "Keyphrase in title</a>: Not all the words from your keyphrase \"El lugar de culto religioso más antiguo del mundo\" appear in the SEO title. For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 6,
		resultText: "Keyphrase in slug</a>: (Part of) your keyphrase does not appear in the slug. Change that</a>!",
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
		resultText: "Keyphrase distribution</a>: Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly</a>.",
	},
	fleschReadingEase: {
		isApplicable: true,
		score: 6,
		resultText: "Flesch Reading Ease</a>: The copy scores 58.1 in the test, which is considered fairly difficult to read. Try to make shorter sentences to improve readability</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "Subheading distribution</a>: You are not using any subheadings, although your text is rather long. Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 6,
		resultText: "Image Keyphrase</a>: Images on this page do not have alt attributes that reflect" +
			" the topic of your text. Add your keyphrase or synonyms to the alt tags of relevant images</a>!",
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

