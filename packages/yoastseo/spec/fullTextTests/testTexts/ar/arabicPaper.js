import Paper from "../../../../src/values/Paper.js";
import content from "./arabicPaper.html";

const name = "arabicPaper";

const paper = new Paper( content, {
	keyword: "العناية بالنباتات",
	synonyms: "",
	description: "أنا أحب النباتات. العناية بالنباتات مفيدة للبيئة ومفيدة. يمكنك زراعة الخضار داخل منزلك طوال العام" +
	". نبتة واحدة تكفي لجعل المنزل أكثر جمالا, بل وأكثر جمالا إذا وضعت النباتات في أواني داخلية جميلة.",
	title: "أفضل النباتات للنمو داخل المنزل وكيفية العناية بالنباتات",
	textTitle: "أفضل النباتات للنمو داخل المنزل وكيفية العناية بالنباتات",
	titleWidth: 450,
	locale: "ar",
	permalink: "",
	slug: "العناية-بالنباتات",
	writingDirection: "RTL",
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
		score: 9,
		resultText: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The keyphrase was found 6 times. This is great!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: Keyphrase or " +
			"synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description " +
			"is over 156 characters. To ensure the entire description will be visible, " +
			"<a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		isApplicable: false,
	},
	textCompetingLinks: {
		isApplicable: true,
		score: 8,
		resultText: "<a href='https://yoa.st/34l' target='_blank'>Competing links</a>: There are no links which use your keyphrase or synonym as their anchor text. Nice!",
	},
	textLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 368 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in " +
			"this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
	},
	internalLinks: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: No internal links appear in " +
			"this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!",
	},
	keyphraseInSEOTitle: {
		isApplicable: true,
		score: 6,
		resultText: "<a href='https://yoa.st/33g' target='_blank'>Keyphrase in SEO title</a>: The exact match of the" +
			" focus keyphrase appears in the SEO title, but not at the beginning." +
			" <a href='https://yoa.st/33h' target='_blank'>Move it to the beginning for the best results</a>.",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	slugKeyword: {
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
		resultText: "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. Some parts of your text do not contain " +
			"the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 2,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: You are not using any subheadings, although your " +
			"text is rather long. <a href='https://yoa.st/34y' target='_blank'>Try and add some subheadings</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: There are no paragraphs that are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You are not using too much passive voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There are no repetitive sentence beginnings. " +
			"That's great!",
	},
	imageKeyphrase: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f7' target='_blank'>Keyphrase in image alt attributes</a>: This page does not have images, a keyphrase, or both. <a href='https://yoa.st/4f6' target='_blank'>Add some images with alt attributes that include the keyphrase or synonyms</a>!",
	},
	imageCount: {
		isApplicable: true,
		score: 3,
		resultText: "<a href='https://yoa.st/4f4' target='_blank'>Images</a>: No images appear on this page." +
			" <a href='https://yoa.st/4f5' target='_blank'>Add some</a>!",
	},
	wordComplexity: {
		isApplicable: false,
	},
	textAlignment: {
		isApplicable: true,
		score: 0,
		resultText: "",
	},
	textTitleAssessment: {
		isApplicable: true,
		score: 9,
		resultText: "<a href='https://yoa.st/4nh' target='_blank'>Title</a>: Your page has a title. Well done!",
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

