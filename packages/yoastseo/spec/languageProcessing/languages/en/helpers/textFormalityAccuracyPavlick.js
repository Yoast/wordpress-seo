import checkTextFormality, { getRequiredFeatures } from "../../../../../src/languageProcessing/languages/en/helpers/checkTextFormality";
import Paper from "../../../../../src/values/Paper";
import Researcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import testData from "./testPapers/en/textFormalityAccuracyPavlick.json";

/**
 * To run this test for accuracy, run this file as a Jest test.
 *
 * The attribute values that are printed can be used to (re)generate the decision tree that's used in checkTextFormality.
 * Use the Python package that's available through https://github.com/mhkuu/yoast-formality.
 */

describe( "a test for the formality classification accuracy", () => {
	it( "should reach a high accuracy for formal texts", () => {
		let count = 0;
		const arrayOfResults = [];
		for ( let i = 0; i < testData.formal.length; i++ ) {
			const paper = new Paper( testData.formal[ i ] );
			const researcher = new Researcher( paper );
			const formality = checkTextFormality( paper, researcher );
			if ( formality === "formal" ) {
				count++;
			}
			arrayOfResults.push( {
				index: i,
				formality: formality,
				features: getRequiredFeatures( paper, researcher ),
			} );
		}

		const accuracy = count / testData.formal.length * 100;
		console.log( `The accuracy of the model on the formal class is: ${accuracy}%` );
		expect( accuracy ).toBeGreaterThanOrEqual( 90 );

		// Below prints the attribute values that can be used to create the decision tree
		console.log( JSON.stringify( arrayOfResults, null, 2 ) );
	} );

	it( "should reach a high accuracy for informal texts", () => {
		let count = 0;
		const arrayOfResults = [];

		for ( let i = 0; i < testData.informal.length; i++ ) {
			const paper = new Paper( testData.informal[ i ] );
			const researcher = new Researcher( paper );
			const formality = checkTextFormality( paper, researcher );
			if ( formality === "informal" ) {
				count++;
			}
			arrayOfResults.push( {
				index: i,
				formality: formality,
				features: getRequiredFeatures( paper, researcher ),
			} );
		}

		const accuracy = count / testData.informal.length * 100;
		console.log( `The accuracy of the model on the informal class is: ${accuracy}%` );
		expect( accuracy ).toBeGreaterThanOrEqual( 90 );

		// Below prints the attribute values that can be used to create the decision tree
		console.log( JSON.stringify( arrayOfResults, null, 2 ) );
	} );
} );
