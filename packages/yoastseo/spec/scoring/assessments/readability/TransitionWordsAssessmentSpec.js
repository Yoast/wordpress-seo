import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Mark from "../../../../src/values/Mark.js";
import buildTree from "../../../specHelpers/parse/buildTree";


describe( "An assessment for checking the percentage of transition words in the text", function() {
	describe( "for a long text (longer than 200 words)", function() {
		it( "returns the score for 0% of the sentences with transition words in a long text", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			// 10 sentences without transition words to make a long text.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 10 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 3 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
				"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
			expect( assessment.hasMarks() ).toBe( false );
		} );

		it( "returns the score for a paper with a long text but no sentences (e.g. only images)", function() {
			const image = "<img src=\"example.com\" alt=\"A tortie sleeping on the sofa\" />";
			const mockPaper = new Paper( image.repeat( 30 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: You are not using any transition words, but your text is short enough and probably doesn't need them." );
			expect( assessment.hasMarks() ).toBe( false );
		} );

		it( "returns the score for 10.0% of the sentences with transition words in a long text (longer than 200 words)", function() {
			// 1 out of 10 sentences contains a transition word.
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip.";
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 9 ) + sentenceWithTransitionWords );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 3 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
				"Only 10% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
				"target='_blank'>Use more of them</a>." );
			expect( assessment.hasMarks() ).toBe( true );
		} );
		it( "returns the score for 20.0% of the sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "Dental disease affects the majority of cats over three years old, and with patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—" +
				"and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip.";
			// 1 out of 5 sentences contains a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 4 ) + sentenceWithTransitionWords );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 6 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
				"Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
				"target='_blank'>Use more of them</a>." );
			expect( assessment.hasMarks() ).toBe( true );
		} );
		it( "returns the score for 25.0% of the sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "Dental disease affects the majority of cats over three years old, and with patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—" +
				"and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 2 out of 8 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 6 ) + sentenceWithTransitionWords.repeat( 2 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 6 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
				"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
				"target='_blank'>Use more of them</a>." );
			expect( assessment.hasMarks() ).toBe( true );
		} );
		it( "returns the score for 35.0% of the sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 7 out of 20 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 13 ) + sentenceWithTransitionWords.repeat( 7 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );
			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );
		it( "returns the score for 40% sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 4 out of 10 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 6 ) + sentenceWithTransitionWords.repeat( 4 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );
			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );

		it( "returns the score for 47% sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 47 out of 100 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 53 ) + sentenceWithTransitionWords.repeat( 47 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );
			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );

		it( "returns the score for 66.7% of the sentences with transition words in a long text (longer than 200 words)", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine—and it makes a significant difference in preventing painful gum disease, tooth loss, and even systemic health problems linked to oral bacteria. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 2 out of 3 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords + sentenceWithTransitionWords.repeat( 2 ) );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );

		it( "should match transition word in image caption", function() {
			const paper = new Paper( "<figure class='wp-block-image size-large'><img src='http://example.com/tortie4.jpg' alt='' class='wp-image-19'></img><figcaption class='wp-element-caption'>This is a cat that would like raw food. Raw food is certainly excellent for cats. Raw food is excellent for cats. Raw food is excellent for cats.</figcaption></figure>" );
			const researcher = new EnglishResearcher( paper );
			buildTree( paper, researcher );
			const result = new TransitionWordsAssessment().getResult( paper, researcher );

			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		} );
	} );

	describe( "for a short text (shorter than 200 words)", function() {
		it( "returns the score for a short text (shorter than 200 words) with a low percentage of sentences with transition words", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine. ";
			const sentenceWithTransitionWords = "Then, apply a dab to their gums while gently lifting their lip. ";
			// 1 out of 10 sentences contains a transition word.
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 9 ) + sentenceWithTransitionWords );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );

		it( "returns the score for a short text with no transition words", function() {
			const sentenceWithoutTransitionWords = "With patience and the right approach toothbrushing can become a manageable part of your cat's healthcare routine. ";
			const mockPaper = new Paper( sentenceWithoutTransitionWords );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>:" +
				" You are not using any transition words, but your text is short enough and probably doesn't need them." );
			expect( assessment.hasMarks() ).toBe( false );
		} );
		it( "returns a good score if the paper has no text", function() {
			const mockPaper = new Paper( "" );
			const researcher = new EnglishResearcher( mockPaper );
			buildTree( mockPaper, researcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, researcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>:" +
				" You are not using any transition words, but your text is short enough and probably doesn't need them." );
			expect( assessment.hasMarks() ).toBe( false );
		} );
	} );
} );
describe( "An assessment for checking the percentage of transition words in a Japanese text ", function() {
	describe( "for a long Japanese text (longer than 400 character)", function() {
		it( "returns the score for a long Japanese text with no transition words.", function() {
			const sentenceWithoutTransitionWords = "根気と適切なアプローチさえあれば、猫の歯磨きは健康管理ルーティンの一部として十分に取り入れられるようになり、痛みを伴う歯肉疾患や歯の喪失、は口腔内の細菌が引き起こす全身的な健康問題の予防に大きな効果をもたらします。";
			const mockPaper = new Paper( sentenceWithoutTransitionWords.repeat( 10 ) );
			const mockResearcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, mockResearcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

			expect( assessment.getScore() ).toEqual( 3 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
				"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
			expect( assessment.hasMarks() ).toBe( false );
		} );
		it( "returns the score for a long Japanese text with a high percentage of sentences with transition words.", function() {
			const sentenceWithoutTransitionWords = "根気と適切なアプローチさえあれば、猫の歯磨きは健康管理ルーティンの一部として十分に取り入れられるようになり、痛みを伴う歯肉疾患や歯の喪失、は口腔内の細菌が引き起こす全身的な健康問題の予防に大きな効果をもたらします。";
			const sentenceWithTransitionWords = "ならば。 ";
			// 9 out of 10 sentences contain a transition word.
			const mockPaper = new Paper( sentenceWithTransitionWords.repeat( 9 ) + sentenceWithoutTransitionWords );
			const mockResearcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, mockResearcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );
	} );
	describe( "for a short Japanese text (shorter than 400 character)", function() {
		it( "returns the score for a short Japanese text with a low percentage of sentences with transition words.", function() {
			const sentenceWithoutTransitionWords = "熱".repeat( 300 ) + "。";
			const mockPaper = new Paper( "ならば。" + sentenceWithoutTransitionWords );
			const mockResearcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, mockResearcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
			expect( assessment.hasMarks() ).toBe( true );
		} );
		it( "returns the score for a short Japanese text with no transition words.", function() {
			const sentenceWithoutTransitionWords = "熱".repeat( 300 ) + "。";
			const mockPaper = new Paper( sentenceWithoutTransitionWords );
			const mockResearcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, mockResearcher );
			const assessment = new TransitionWordsAssessment().getResult( mockPaper, mockResearcher );

			expect( assessment.getScore() ).toEqual( 9 );
			expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>:" +
				" You are not using any transition words, but your text is short enough and probably doesn't need them." );
			expect( assessment.hasMarks() ).toBe( false );
		} );
	} );
} );

describe( "A test for applicability", function() {
	it( "is applicable when used with a supported researcher, e.g. the English researcher", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum.", { locale: "en_US" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when used with a non-supported researcher, e.g. the default researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "xx_YY" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new DefaultResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking sentences containing a transition word", function() {
	it( "returns markers for sentences containing transition words", function() {
		const paper = new Paper( "This sentence is marked, because it contains a transition word." );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );
		const expected = [
			new Mark( {
				position: {
					startOffset: 0,
					endOffset: 63,
					startOffsetBlock: 0,
					endOffsetBlock: 63,
					clientId: "",
					attributeId: "",
					isFirstSection: false,
				} } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences contain a transition word", function() {
		const paper = new Paper( "This sentence is not marked." );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( [] );
	} );

	it( "returns markers for an image caption containing transition words", function() {
		const paper = new Paper( "<figure class='wp-block-image size-large'><img src='http://example.com/tortie4.jpg' alt='' class='wp-image-19'></img><figcaption class='wp-element-caption'>This is a cat that would like raw food. Raw food is certainly excellent for cats. Raw food is excellent for cats. Raw food is excellent for cats.</figcaption></figure>" );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );
		const expected = [
			new Mark( {
				position: {
					startOffset: 196,
					endOffset: 237,
					startOffsetBlock: 40,
					endOffsetBlock: 81,
					clientId: "",
					attributeId: "",
					isFirstSection: false,
				},
			} ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( expected );
	} );
} );
