var urlLengthAssessment = require( "../../js/assessments/urlLength.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessment for the urlLengthAssessment", function(){
    it( "runs the fleschReading on the paper", function(){
        var paper = new Paper();
        var result = urlLengthAssessment( paper, Factory.buildMockResearcher( true ), i18n );

        expect( result.score ).toBe( 5 );
        expect( result.text ).toBe( "The slug for this page is a bit long, consider shortening it." );

        var paper = new Paper();
        var result = urlLengthAssessment( paper, Factory.buildMockResearcher( false ), i18n );

        expect( result ).toBeUndefined() ;
    } );
} );