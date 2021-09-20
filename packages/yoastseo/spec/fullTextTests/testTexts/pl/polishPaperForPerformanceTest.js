/*
 * This paper is used for a performance test in the content analysis app which compares how long it takes to analyse papers
 * in different languages. The paper is actually a Russian paper with a Polish locale, so not representative of a real life
 * scenario, but using the same paper with different locales allows for optimal performance comparison across languages.
 */

import Paper from "../../../../src/values/Paper.js";
import content from "./polishPaperForPerformanceTest.html";

const name = "polishPaperForPerformanceTest";

const paper = new Paper( content, {
	keyword: "Зелёная книга",
	synonyms: "путеводитель, the Green Book",
	description: "Зелёная книга - краткое название ежегодного путеводителя для чернокожих автомобилистов, который издавался в США с 1936 по 1966 год",
	title: "Зелёная книга (путеводитель)",
	titleWidth: 450,
	locale: "pl_PL",
	permalink: "https://ru.wikipedia.org/wiki/Зелёная_книга_(путеводитель)",
	url: "Зелёная_книга_(путеводитель)",
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
		resultText: "Keyphrase density</a>: The focus keyphrase was found 5 times. That's less than the recommended minimum of 6 times for a text of this length. Focus on your keyphrase</a>!",
	},
	metaDescriptionKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in meta description</a>: Keyphrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		isApplicable: true,
		score: 9,
		resultText: "Meta description length</a>: Well done!",
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
		resultText: "Text length</a>: The text contains 1390 words. Good job!",
	},
	externalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Outbound links</a>: Good job!",
	},
	internalLinks: {
		isApplicable: true,
		score: 9,
		resultText: "Internal links</a>: You have enough internal links. Good job!",
	},
	titleKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in title</a>: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
	},
	titleWidth: {
		isApplicable: true,
		score: 9,
		resultText: "SEO title width</a>: Good job!",
	},
	urlKeyword: {
		isApplicable: true,
		score: 9,
		resultText: "Keyphrase in slug</a>: Great work!",
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
		score: 9,
		resultText: "Keyphrase distribution</a>: Good job!",
	},
	fleschReadingEase: {
		isApplicable: false,
		score: 9,
		resultText: "Sentence length</a>: 30.3% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%. Try to shorten the sentences</a>.",
	},
	subheadingsTooLong: {
		isApplicable: true,
		score: 3,
		resultText: "Subheading distribution</a>: 2 sections of your text are longer than 300 words and are not separated by any subheadings. Add subheadings to improve readability</a>.",
	},
	textParagraphTooLong: {
		isApplicable: true,
		score: 9,
		resultText: "Paragraph length</a>: None of the paragraphs are too long. Great job!",
	},
	textSentenceLength: {
		isApplicable: true,
		score: 3,
		resultText: "Sentence length</a>: 30.3% of the sentences contain more than 20 words, which is more than the recommended maximum of 15%. Try to shorten the sentences</a>.",
	},
	textTransitionWords: {
		isApplicable: true,
		score: 3,
		resultText: "Transition words</a>: None of the sentences contain transition words. Use some</a>.",
	},
	passiveVoice: {
		isApplicable: true,
		score: 9,
		resultText: "Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		isApplicable: true,
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
		resultText: "Image Keyphrase</a>: Images on this page do not have alt attributes with at least" +
			" half of the words from your keyphrase. Fix that</a>!",
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

