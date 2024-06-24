import { forEach } from "lodash";
import ContentAssessor from "../../../../src/scoring/assessors/storePostsAndPages/contentAssessor.js";
import AssessmentResult from "../../../../src/values/AssessmentResult.js";
import Paper from "../../../../src/values/Paper.js";

import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import DutchResearcher from "../../../../src/languageProcessing/languages/nl/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher.js";
import WordComplexityAssessment from "../../../../src/scoring/assessments/readability/WordComplexityAssessment.js";
import wordComplexity from "../../../../src/languageProcessing/researches/wordComplexity.js";

import getWordComplexityConfig from "../../../../src/helpers/getWordComplexityConfig.js";
import getWordComplexityHelper from "../../../../src/helpers/getWordComplexityHelper.js";

describe( "A content assessor for English", function() {
	let results, contentAssessor, researcher, paper;

	beforeAll( function() {
		paper = new Paper();
		researcher = new EnglishResearcher( paper );
		// Also register the assessment, research, helper, and config for Word Complexity for testing purposes.
		researcher.addResearch( "wordComplexity", wordComplexity );
		researcher.addHelper( "checkIfWordIsComplex", getWordComplexityHelper( "en" ) );
		researcher.addConfig( "wordComplexity", getWordComplexityConfig( "en" ) );
		contentAssessor = new ContentAssessor( researcher );
		contentAssessor.addAssessment( "wordComplexity", new WordComplexityAssessment( {
			urlTitle: "https://yoa.st/shopify77",
			urlCallToAction: "https://yoa.st/shopify78",
		} ) );

		contentAssessor.getValidResults = function() {
			return results;
		};

		contentAssessor.getPaper = function() {
			return paper;
		};
	} );

	describe( "calculatePenaltyPoints", function() {
		it( "should have no points for an empty result set", function() {
			results = [];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 0 for all green assessment results", function() {
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 3 for a red assessment result", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};

			results = [
				new AssessmentResult( { score: 3 } ),
			];
			const expected = 3;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 2 for an orange assessment result", function() {
			results = [
				new AssessmentResult( { score: 6 } ),
			];
			const expected = 2;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return an aggregate for a mixed resultset", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { text: "A piece of feedback" } ),
			];
			const expected = 6 + 6;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "calculateOverallScore for English", function() {
		let points;
		beforeEach( function() {
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
		} );

		it( "should default to a bad indicator", function() {
			const expected = 30;
			results = [];

			const actual = contentAssessor.calculateOverallScore();

			expect( actual ).toBe( expected );
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 7, expected: 30 },
				{ points: 6, expected: 60 },
				{ points: 9, expected: 30 },
				{ points: 4, expected: 90 },
				{ points: 2, expected: 90 },
				{ points: 1.9, expected: 90 },
				{ points: 1, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				contentAssessor._allAssessmentsSupported = function() {
					return true;
				};

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "Checks the applicable assessments", function() {
		it( "Should have 8 available assessments for a fully supported language. " +
			"This doesn't include Word complexity assessment since the registration is done from Shopify side.", function() {
			paper = new Paper( "Lorem ipsum dolor sit amet, voluptua probatus ullamcorper id vis, ceteros consetetur qui ea, " +
				"nam movet populo aliquam te. His eu debitis fastidii. Pri ea amet dicant. Ut his suas corpora, eu reformidans " +
				"signiferumque duo. At erant expetenda patrioque quo, rebum atqui nam ad, tempor elaboraret interpretaris pri ad. " +
				"Novum postea sea in. Placerat recteque cu usu. Cu nam sadipscing disputationi, sed labitur elaboraret et. Eu sed " +
				"accumsan prodesset. Posse integre et nec, usu assum audiam erroribus eu. Ei viris eirmod interesset usu, " +
				"usu homero liberavisse in, solet disputando ea vim. Mei eu inani nonumes consulatu, ea alterum menandri ius, " +
				"ne euismod neglegentur sed. Vis te deleniti suscipit, fabellas laboramus pri ei. Te quo aliquip offendit. " +
				"Vero paulo regione ei eum, sed at atqui meliore copiosae. Has et vocent vivendum. Mundi graeco latine cum ne, " +
				"no cum laoreet alienum. Quo cu vero utinam constituto. Vis omnium vivendum ea. Eum lorem ludus possim ut. Eu has eius " +
				"munere explicari, atqui ullamcorper eos no, harum epicuri per ut. Utamur volumus minimum ea vel, duo eu praesent " +
				"accommodare. Mutat gloriatur ex cum, rebum salutandi ei his, vis delenit quaestio ne. Iisque qualisque duo ei. " +
				"Splendide tincidunt te sit, commune oporteat quo id. Sumo recusabo suscipiantur duo an, no eum malis vulputate " +
				"consectetuer. Mel te noster invenire, nec ad vidisse constituto. Eos ut quod.", { locale: "en_US" } );
			researcher.setPaper( paper );
			contentAssessor.getPaper = function() {
				return paper;
			};
			const assessments = contentAssessor.getApplicableAssessments();
			const expected = 8;

			expect( assessments.length ).toBe( expected );
			expect( assessments.map( ( { identifier } ) => identifier ) ).toEqual(
				[
					"subheadingsTooLong",
					"textParagraphTooLong",
					"textSentenceLength",
					"textTransitionWords",
					"passiveVoice",
					"textPresence",
					"sentenceBeginnings",
					"wordComplexity",
				]
			);
		} );
	} );

	describe( "has configuration overrides", () => {
		test( "SubheadingsDistributionTooLong", () => {
			const assessment = contentAssessor.getAssessment( "subheadingsTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.shouldNotAppearInShortText ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify68' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify69' target='_blank'>" );
		} );

		test( "SentenceLengthAssessment", () => {
			const assessment = contentAssessor.getAssessment( "textSentenceLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify48' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify49' target='_blank'>" );
		} );

		test( "ParagraphTooLong", () => {
			const assessment = contentAssessor.getAssessment( "textParagraphTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify66' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify67' target='_blank'>" );
		} );

		test( "TransitionWords", () => {
			const assessment = contentAssessor.getAssessment( "textTransitionWords" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify44' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify45' target='_blank'>" );
		} );

		test( "PassiveVoice", () => {
			const assessment = contentAssessor.getAssessment( "passiveVoice" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify42' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify43' target='_blank'>" );
		} );

		test( "TextPresence", () => {
			const assessment = contentAssessor.getAssessment( "textPresence" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify56' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify57' target='_blank'>" );
		} );

		test( "SentenceBeginnings", () => {
			const assessment = contentAssessor.getAssessment( "sentenceBeginnings" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify5' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify65' target='_blank'>" );
		} );
	} );
} );

describe( "A test for content assessor for non-English", () => {
	describe( "calculateOverallScore for non English with a text containing more than 200 words", function() {
		let points, results, contentAssessor;

		const paper = new Paper( "Lorem ipsum dolor sit amet, voluptua probatus ullamcorper id vis, ceteros consetetur qui ea, " +
			"nam movet populo aliquam te. His eu debitis fastidii. Pri ea amet dicant. Ut his suas corpora, eu reformidans " +
			"signiferumque duo. At erant expetenda patrioque quo, rebum atqui nam ad, tempor elaboraret interpretaris pri ad. " +
			"Novum postea sea in. Placerat recteque cu usu. Cu nam sadipscing disputationi, sed labitur elaboraret et. Eu sed " +
			"accumsan prodesset. Posse integre et nec, usu assum audiam erroribus eu. Ei viris eirmod interesset usu, " +
			"usu homero liberavisse in, solet disputando ea vim. Mei eu inani nonumes consulatu, ea alterum menandri ius, " +
			"ne euismod neglegentur sed. Vis te deleniti suscipit, fabellas laboramus pri ei. Te quo aliquip offendit. " +
			"Vero paulo regione ei eum, sed at atqui meliore copiosae. Has et vocent vivendum. Mundi graeco latine cum ne, " +
			"no cum laoreet alienum. Quo cu vero utinam constituto. Vis omnium vivendum ea. Eum lorem ludus possim ut. Eu has eius " +
			"munere explicari, atqui ullamcorper eos no, harum epicuri per ut. Utamur volumus minimum ea vel, duo eu praesent " +
			"accommodare. Mutat gloriatur ex cum, rebum salutandi ei his, vis delenit quaestio ne. Iisque qualisque duo ei. " +
			"Splendide tincidunt te sit, commune oporteat quo id. Sumo recusabo suscipiantur duo an, no eum malis vulputate " +
			"consectetuer. Mel te noster invenire, nec ad vidisse constituto. Eos ut quod.", { locale: "nl_NL" } );

		beforeEach( function() {
			contentAssessor = new ContentAssessor( new DutchResearcher( paper ) );
			contentAssessor.addAssessment( "wordComplexity", new WordComplexityAssessment( {
				urlTitle: "https://yoa.st/shopify77",
				urlCallToAction: "https://yoa.st/shopify78",
			} ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "calculateOverallScore for non English with an empty paper", function() {
		let points, results, contentAssessor;

		let paper = new Paper( "", { locale: "jv_ID" } );

		beforeEach( function() {
			contentAssessor = new ContentAssessor( new DefaultResearcher( paper ) );
			contentAssessor.addAssessment( "wordComplexity", new WordComplexityAssessment( {
				urlTitle: "https://yoa.st/shopify77",
				urlCallToAction: "https://yoa.st/shopify78",
			} ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );

		// A text of at least 50 characters.
		const longEnoughText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis. There is more";
		paper = new Paper( longEnoughText, { locale: "xx_XX" } );

		it( "Should have 4 available assessments for a basic supported language", function() {
			const assessments = contentAssessor.getApplicableAssessments();
			const expected = 4;
			expect( assessments.length ).toBe( expected );
			expect( assessments.map( ( { identifier } ) => identifier ) ).toEqual(
				[
					"subheadingsTooLong",
					"textParagraphTooLong",
					"textSentenceLength",
					"textPresence",
				]
			);
		} );
	} );
} );
