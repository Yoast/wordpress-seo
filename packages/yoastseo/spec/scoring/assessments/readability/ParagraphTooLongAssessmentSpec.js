import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";
import paragraphLengthJapanese from "../../../../src/languageProcessing/languages/ja/config/paragraphLength";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

const paragraphTooLongAssessment = new ParagraphTooLongAssessment();
const shortTextJapanese = "は".repeat( 300 );
const longTextJapanese = "は".repeat( 360 );
const veryLongTextJapanese = "は".repeat( 410 );

describe( "An assessment for scoring too long paragraphs.", function() {
	const paper = new Paper();
	it( "scores 1 paragraph with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 160, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 6000, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 83, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 71, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { countLength: 60, text: "" },
			{ countLength: 191, text: "" }, { countLength: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns an empty assessment result for a paper without paragraphs.", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ) );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
} );

describe( "Counts words instead of characters in Japanese", function() {
	it( "Scores 1 slightly too long paragraph", function() {
		const paper = new Paper( longTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "Scores 1 too long paragraph", function() {
		const paper = new Paper( veryLongTextJapanese );

		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "Scores 2 slightly too long paragraphs", function() {
		const paper = new Paper( shortTextJapanese + "<p>" + longTextJapanese + "</p><p>" + longTextJapanese + "</p>"  );
		const assessment = paragraphTooLongAssessment.getResult( paper, new JapaneseResearcher( paper ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 300 characters." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
} );

describe( "Applicability of the assessment.", function() {
	it( "returns true for isApplicable on a paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( true );
	} );
	it( "returns false for isApplicable on a paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { countLength: 210, text: "This is a very interesting paper." } ] );
		const expected = [
			new Mark( { original: "This is a very interesting paper.", marked: "<yoastmark class='yoast-text-mark'>This is" +
					" a very interesting paper.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns markers for a default text", function() {
		const paper = new Paper( "You just got Yoast SEO, and you are ready to get the most out of it! Or, have you already been using it for a" +
			"while and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its best. " +
			"That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the right way! Read " +
			"on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the top of your general " +
			"WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link takes you to the Workouts " +
			"screen, where you can find and access the Configuration workout by clicking the Start workout button. If you’ve finished the workout " +
			"but want to revise some steps, you can find it in the Workouts menu item of the SEO menu (see bottom of image). Now, let’s go through " +
			"the workout’s steps. Choose Organization if you have a professional or a company website. For example, if we were filling in the data " +
			"for yoast.com, we would choose Organization. You’ll then need to add the Organization’s name, logo, and tagline." );
		const paragraphTooLong = new EnglishResearcher( paper );
		const expected = [
			new Mark( { original: "You just got Yoast SEO, and you are ready to get the most out of it! Or, have you already been using it for a " +
					"while and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its " +
					"best. That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the " +
					"right way! Read on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the " +
					"top of your general WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link" +
					" takes you to the Workouts screen, where you can find and access the Configuration workout by clicking the Start workout " +
					"button. If you’ve finished the workout but want to revise some steps, you can find it in the Workouts menu item of the SEO " +
					"menu (see bottom of image). Now, let’s go through the workout’s steps. Choose Organization if you have a professional or a " +
					"company website. For example, if we were filling in the data for yoast.com, we would choose Organization. You’ll then need to" +
					" add the Organization’s name, logo, and tagline.", marked: "<yoastmark class='yoast-text-mark'>You just got Yoast SEO, and " +
					"you are ready to get the most out of it! Or, have you already been using it for a while" +
					"and know your way around it? Either way, you should use some essential Yoast SEO settings to let the plugin work at its best. " +
					"That’s why we’ve created a Yoast SEO configuration workout! In five steps, we guide you in setting up Yoast SEO the right way!" +
					" Read on to learn more about each step. If you just installed Yoast SEO, you’ll find a link to the workout at the top of your" +
					" general WordPress Dashboard, as well as on top of all the screens of the Yoast SEO settings (see image). The link takes you " +
					"to the Workouts screen, where you can find and access the Configuration workout by clicking the Start workout button. If " +
					"you’ve finished the workout but want to revise some steps, you can find it in the Workouts menu item of the SEO menu (see " +
					"bottom of image). Now, let’s go through the workout’s steps. Choose Organization if you have a professional or a company " +
					"website. For example, if we were filling in the data for yoast.com, we would choose Organization. You’ll then need to add " +
					"the Organization’s name, logo, and tagline.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns markers for a text in Japanese", function() {
		const paper = new Paper( "接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。学校文法では、接続詞は文の成分" +
			"としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、山田文法では副詞の一類として接続副詞" +
			"としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。つまり、接続詞は前文を受けて、後文の文末まで" +
			"係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。このように接続詞は前文の内容を後文へと持ち込んで、" +
			"どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。後文への修飾語的性格を持っています。" );
		const paragraphTooLong = new JapaneseResearcher( paper );
		const expected = [
			new Mark( { original: "接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。学校文法では、接続詞は文の成分" +
					"としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、山田文法では副詞の一類として接続副詞" +
					"としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。つまり、接続詞は前文を受けて、後文の文末まで" +
					"係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。このように接続詞は前文の内容を後文へと持ち込んで、" +
					"どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。後文への修飾語的性格を持っています。", marked:
					"<yoastmark class='yoast-text-mark'>接続詞は、文と文との中間に位置しています。前文と後文との間にあって、両者の関係を示している言葉です。" +
					"学校文法では、接続詞は文の成分としては独立語として扱われておりますが、独立語でないとする文法学説もあります。松下文法では一品詞としないで副詞に含め、" +
					"山田文法では副詞の一類として接続副詞としており、芳賀やすしは接続詞を承前副詞と並立連体詞とに二分しています。時枝文法では「辞」として扱っています。" +
					"つまり、接続詞は前文を受けて、後文の文末まで係っていく副詞のような働きをしているということです。独立語として中立的に結びつけている言葉ではありません。" +
					"このように接続詞は前文の内容を後文へと持ち込んで、どんな関係になっているかを示し、後文の文末まで係っていく、そうした副詞と似た働きをしています。" +
					"後文への修飾語的性格を持っています。</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { countLength: 60, text: "" }, { countLength: 11, text: "" },
			{ countLength: 13, text: "" } ] );
		const expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );

describe( "test for paragraph too long assessment when is used in product page analysis", function() {
	it( "assesses a paper from product page with paragraphs that contain less than 70 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 60, text: "" },
			{ countLength: 11, text: "" },
			{ countLength: 13, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
			"None of the paragraphs are too long. Great job!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain more than 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 110, text: "" },
			{ countLength: 150, text: "" },
			{ countLength: 150, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain" +
			" more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain between 70 and 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [
			{ countLength: 90, text: "" },
			{ countLength: 75, text: "" },
			{ countLength: 80, text: "" },
		] ) );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
			"more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
} );

describe( "test for paragraph too long assessment for languages that have language-specific config", () => {
	// Japanese has a language specific config for paragraph length. The config is used for the unit tests below.
	describe( "test for non-product pages", () => {
		it( "assesses a paper with paragraphs that contain less than 300 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 200, text: "" },
				{ countLength: 260, text: "" },
				{ countLength: 100, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "assesses a paper with two paragraphs that contain more than 400 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "assesses a paper with paragraphs that contain 300-400 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 350, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 390, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment().getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs contain " +
				"more than the recommended maximum of 300 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
	describe( "test for product pages", () => {
		it( "assesses a paper with paragraphs that contain less than 140 characters (green bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 100, text: "" },
				{ countLength: 120, text: "" },
				{ countLength: 90, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );

			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );
			expect( result.getScore() ).toEqual( 9 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: " +
				"None of the paragraphs are too long. Great job!" );
		} );
		it( "assesses a paper with three paragraphs that contain more than 200 characters (red bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 400, text: "" },
				{ countLength: 300, text: "" },
				{ countLength: 500, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 3 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
		it( "assesses a paper with all paragraphs that contain 140-200 characters (orange bullet)", function() {
			const paper = new Paper( "" );
			const mockResearcher = factory.buildMockResearcher( [
				{ countLength: 150, text: "" },
				{ countLength: 170, text: "" },
				{ countLength: 200, text: "" },
			],
			false,
			false,
			paragraphLengthJapanese );
			const result = new ParagraphTooLongAssessment( {}, true ).getResult( paper, mockResearcher );

			expect( result.getScore() ).toEqual( 6 );
			expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain " +
				"more than the recommended maximum of 140 characters. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		} );
	} );
} );

