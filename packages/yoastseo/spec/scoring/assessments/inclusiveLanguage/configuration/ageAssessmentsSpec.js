import Paper from "../../../../../src/values/Paper";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/ageAssessments";

describe( "Age assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at aging dependants" );
		const assessor = new InclusiveLanguageAssessment( assessments[ 1 ] );

		const isApplicable = assessor.isApplicable( mockPaper );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using \"aging dependants\" as it is potentially harmful. " +
			"Consider using \"older persons/older people\" instead unless referring to yourself or to " +
			"someone who explicitly wants to be referred to with this term. " +
			"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\"). " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at senior citizens" );
		const assessor = new InclusiveLanguageAssessment( assessments[ 0 ] );

		const isApplicable = assessor.isApplicable( mockPaper );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using \"senior citizens\" as it is potentially harmful. " +
			"Consider using \"older persons/older people, older citizen(s)\" instead unless referring to yourself or to " +
			"someone who explicitly wants to be referred to with this term. " +
			"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\"). " +
			"<a href='https://yoa.st/' target='_blank'>Learn more.</a>" );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "This ad is aimed at youth" );
		const assessor = new InclusiveLanguageAssessment( assessments[ 0 ] );

		const isApplicable = assessor.isApplicable( mockPaper );

		expect( isApplicable ).toBeFalsy();
	} );
} );
