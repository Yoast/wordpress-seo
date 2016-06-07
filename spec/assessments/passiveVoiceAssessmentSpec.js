var passiveVoiceAssessment = require( "../../js/assessments/passiveVoiceAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

var paper = new Paper();
describe( "An assessment for scoring passive voice.", function() {
	it( "scores 1 passive sentence - 5%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( {total: 20, passives: [ 1 ]} ), i18n );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "5% of the sentences contain a <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, " +
			"which is less than or equal to the recommended maximum of 10%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 2 passive sentences - 10%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( {total: 20, passives: [ 1, 2 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 7 );
		expect( assessment.getText() ).toBe( "10% of the sentences contain a <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, " +
			"which is less than or equal to the recommended maximum of 10%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 10 passive sentence - 50%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( {total: 20, passives: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "50% of the sentences contain a <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, " +
			"which is more than the recommended maximum of 10%. Try to use their active counterparts." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 25%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( {total: 20, passives: [ 1, 2, 3, 4, 5 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "25% of the sentences contain a <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, " +
			"which is more than the recommended maximum of 10%. Try to use their active counterparts." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "scores 5 passive sentences - 33%", function() {
		var assessment = passiveVoiceAssessment.getResult( paper, Factory.buildMockResearcher( {total: 30, passives: [ 1, 2, 3, 4 ] } ), i18n );
		expect( assessment.getScore() ).toBe( 5 );
		expect( assessment.getText() ).toBe( "13.3% of the sentences contain a <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, " +
			"which is more than the recommended maximum of 10%. Try to use their active counterparts." );
		expect( assessment.hasMarks() ).toBe( true );
	} );


});
