import ProductIdentifiersAssessment from "../../../../src/scoring/assessments/seo/ProductIdentifiersAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const assessment = new ProductIdentifiersAssessment( { isWoo: true } );

describe( "An assessment to check whether the right research is called depending on the repository", function() {
	it( "returns the default result when the paper doesn't contain an H1", function() {
		const paper = new Paper( "" );
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "Feedback for green" );
	} );

	it( "returns the default result when the paper doesn't contain an H1", function() {
		const paper = new Paper( "" );
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "Feedback for orange" );
	} );

	it( "returns the default result when the paper doesn't contain an H1", function() {
		const paper = new Paper( "" );
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "A different feedback for orange" );
	} );
} );

