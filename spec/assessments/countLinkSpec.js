var linkStatisticAssessment = require( "../../js/assessments/countLinks.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessor running the linkStatistics", function(){
	it( "Accepts a paper and i18nobject  ", function(){
		var mockPaper = new Paper( "" );
		var assessment = linkStatisticAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( 'No outbound links appear in this page, consider adding some as appropriate.' );
	} );

} );
