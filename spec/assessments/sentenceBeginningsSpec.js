import sentenceBeginningsAssessment from "../../src/assessments/readability/sentenceBeginningsAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

var paper = new Paper();
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores one instance with 4 consecutive English sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "cup", count: 2 }, { word: "laptop", count: 1 },
			{ word: "table", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 4 consecutive sentences starting with the same word. Try to mix things up!" );
	} );

	it( "scores two instance with too many consecutive English sentences starting with the same word, 5 being the lowest count.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "banana", count: 6 }, { word: "pencil", count: 1 },
			{ word: "bottle", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 2 instances where 5 or more consecutive sentences start with the same word. Try to mix things up!" );
	} );

	it( "scores zero instance with too many consecutive English sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 1 }, { word: "telephone", count: 2 }, { word: "towel", count: 2 },
			{ word: "couch", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );

	it( "scores one instance with 4 consecutive German sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 2 }, { word: "Stuhl", count: 2 }, { word: "Banane", count: 1 },
			{ word: "Tafel", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 4 consecutive sentences starting with the same word. Try to mix things up!" );
	} );

	it( "scores two instance with too many consecutive German sentences starting with the same word, 5 being the lowest count.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 2 }, { word: "Banane", count: 6 }, { word: "Blatt", count: 1 },
			{ word: "Schloss", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 2 instances where 5 or more consecutive sentences start with the same word. Try to mix things up!" );
	} );

	it( "scores zero instance with too many consecutive German sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hallo", count: 1 }, { word: "Telefon", count: 2 }, { word: "Hund", count: 2 },
			{ word: "Haus", count: 1 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );

	it( "is not applicable for a paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "" ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable for a German paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "de_DE" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a German paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "hallo", { locale: "de_DE" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a French paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "fr_FR" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a French paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "bonjour", { locale: "fr_FR" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Spanish paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "es_ES" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Spanish paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "hola", { locale: "es_ES" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Dutch paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "nl_NL" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Dutch paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "hallo", { locale: "nl_NL" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for an Italian paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "it_IT" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for an Italian paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "ciao", { locale: "it_IT" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Russian paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "ru_RU" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Russian paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "почему", { locale: "ru_RU" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a Polish paper without text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "", { locale: "pl_PL" } ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for a Polish paper with text.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "cześć", { locale: "pl_PL" } ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for a paper with text and a non-existing locale.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "hello", { locale: "xx_YY" } ) );
		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		var sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 4, sentences: [ "Hey, hello.", "Hey, hey.", "Hey you.", "Hey." ] } ] );
		var expected = [
			new Mark( { original: "Hey, hello.", marked: "<yoastmark class='yoast-text-mark'>Hey, hello.</yoastmark>" } ),
			new Mark( { original: "Hey, hey.", marked: "<yoastmark class='yoast-text-mark'>Hey, hey.</yoastmark>" } ),
			new Mark( { original: "Hey you.", marked: "<yoastmark class='yoast-text-mark'>Hey you.</yoastmark>" } ),
			new Mark( { original: "Hey.", marked: "<yoastmark class='yoast-text-mark'>Hey.</yoastmark>" } ),
		];
		expect( sentenceBeginningsAssessment.getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		var sentenceBeginnings = Factory.buildMockResearcher( [ { word: "hey", count: 2, sentences: [ "Hey, hello.", "Hey, hey." ] } ] );
		var expected = [];
		expect( sentenceBeginningsAssessment.getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );
} );

