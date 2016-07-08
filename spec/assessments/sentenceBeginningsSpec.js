var sentenceBeginningsAssessment = require( "../../js/assessments/sentenceBeginningsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();
var Mark = require( "../../js/values/Mark.js" );

var paper = new Paper();
describe( "An assessment for scoring repeated sentence beginnings.", function() {
	it( "scores one instance with 4 consecutive sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "cup", count: 2 }, { word: "laptop", count: 1 },
			{ word: "table", count: 4 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 4 consecutive sentences starting with the same word. Try to mix things up!" );
	} );

	it( "scores two instance with too many consecutive sentences starting with the same word, 5 being the lowest count.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 2 }, { word: "banana", count: 6 }, { word: "pencil", count: 1 },
			{ word: "bottle", count: 5 } ] ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "The text contains 2 instances where 5 or more consecutive sentences start with the same word. Try to mix things up!" );
	} );

	it( "scores zero instance with too many consecutive sentences starting with the same word.", function() {
		var assessment = sentenceBeginningsAssessment.getResult( paper, Factory.buildMockResearcher( [ { word: "hey", count: 1 }, { word: "telephone", count: 2 }, { word: "towel", count: 2 },
			{ word: "couch", count: 1 } ] ), i18n );
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

	it( "is not applicable for a paper with text and a locale that is not en or de.", function() {
		var assessment = sentenceBeginningsAssessment.isApplicable( new Paper( "hello", { locale: "xx_YY" } ) );
		expect( assessment ).toBe( false );
	} );
});

describe( "A test for marking the sentences", function() {
	it ("returns markers", function() {
		var sentenceBeginnings = Factory.buildMockResearcher( [ { word: 'hey', count: 4, sentences: [ "Hey, hello.", "Hey, hey.", "Hey you.", "Hey." ] } ] );
		var expected = [
			new Mark({ original: 'Hey, hello.', marked: "<yoastmark class='yoast-text-mark'>Hey, hello.</yoastmark>" }),
			new Mark({ original: 'Hey, hey.', marked: "<yoastmark class='yoast-text-mark'>Hey, hey.</yoastmark>" }),
			new Mark({ original: 'Hey you.', marked: "<yoastmark class='yoast-text-mark'>Hey you.</yoastmark>" }),
			new Mark({ original: 'Hey.', marked: "<yoastmark class='yoast-text-mark'>Hey.</yoastmark>" })
		];
		expect( sentenceBeginningsAssessment.getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );

	it ("returns no markers", function() {
		var sentenceBeginnings = Factory.buildMockResearcher( [ { word: 'hey', count: 2, sentences: [ "Hey, hello.", "Hey, hey." ] } ] );
		var expected = [];
		expect( sentenceBeginningsAssessment.getMarks( paper, sentenceBeginnings ) ).toEqual( expected );
	} );
});

