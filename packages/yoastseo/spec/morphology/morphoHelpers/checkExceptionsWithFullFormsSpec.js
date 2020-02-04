import checkExceptionsWithFullForms  from "../../../src/morphology/morphoHelpers/checkExceptionsWithFullForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for getting the correct stem from full forms exception lists", () => {
	it( "return the correct stem when the word checked is listed in the full form exception list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL.stemming.stemmingExceptionStemsWithFullForms, "stadje" ) ).toEqual( "stad" );
	} );
	it( "return the correct stem when the word checked is listed in the full form exception list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL.stemming.stemmingExceptionStemsWithFullForms, "museumpjes" ) ).toEqual( "museum" );
	} );
	it( "return the correct stem when the word checked is listed in the full form exception list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL.stemming.stemmingExceptionStemsWithFullForms, "fitnesscentra" ) ).toEqual(
			"fitnesscentrum" );
	} );
	it( "returns null if the word checked is not in the exception list", () => {
		expect( checkExceptionsWithFullForms( morphologyDataNL.stemming.stemmingExceptionStemsWithFullForms, "plant" ) ).toEqual( null );
	} );
} );
