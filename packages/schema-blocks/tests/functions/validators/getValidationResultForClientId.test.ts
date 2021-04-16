import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import {
	BlockValidation,
	BlockValidationResult,
} from "../../../src/core/validation";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";
import { getValidationResultForClientId } from "../../../src/functions/validators";

let input: BlockValidationResult[] = [];

const defaultTestInput = [
	BlockValidationResult.Valid( { clientId: "validClientId" } as unknown as BlockInstance, "yoast/valid-block", BlockPresence.Required ),
	BlockValidationResult.MissingBlock( "yoast/missing-block", BlockPresence.Required ),
];
const nestedValidationResult = {
	clientId: "BlockWithNestedIssues",
	result: BlockValidation.Invalid,
	issues: [
		{
			clientId: "NestedBlockwithIssues",
			result: BlockValidation.MissingRequiredVariation,
			issues: [],
		} as BlockValidationResult,
	],
} as BlockValidationResult;

jest.mock( "@wordpress/data", () => {
	return {
		select: jest.fn( ( store ) => {
			getSchemaBlocksValidationResults: function() {
				return input.map( item => )
			}
		} ),
	};
} );

describe( "The getValidationResultForClientId function ", () => {
	it( "returns null if no validation is found for the given clientId", () => {
		// Arrange.
		const input = defaultTestInput;

		// Act.
		const result = getValidationResultForClientId( "clientId does not occur in list", input );

		// Assert.
		expect( result ).toBeNull();
	} );

	it( "retrieves the validation results from the store if none are passed as argument.", () => {
		// Arrange.
		const input = null;

		// Act.
		const result = getValidationResultForClientId( "clientId does not occur in list" );

		// Assert.
		expect

	} );

	it( "returns the validationResult for the clientId if it is nested 1 level deep", () => {
		// Arrange.
		const input = defaultTestInput;
		input.push( nestedValidationResult );

		// Act.
		const validation = getValidationResultForClientId( "NestedBlockwithIssues", input );

		// Assert.
		expect( validation ).not.toBeNull();
		expect( validation.result ).toBe( BlockValidation.MissingRequiredVariation );
	} );

	it( "returns the validationResult for the clientId if it is nested more than 1 level deep", () => {
		// Arrange.
		const input = defaultTestInput;
		input[ 0 ].issues.push( nestedValidationResult );

		// Act.
		const validation = getValidationResultForClientId( "NestedBlockwithIssues", input );

		// Assert.
		expect( validation ).not.toBeNull();
		expect( validation.result ).toBe( BlockValidation.MissingRequiredVariation );
	} );
} );

/*

Export function getValidationResultForClientId( clientId: string, validationResults?: BlockValidationResult[] ): BlockValidationResult {
	if ( ! validationResults ) {
		validationResults = getValidationResults();
	}

	for ( const validationResult of validationResults ) {
		// When the validation result matches the client id, return it.
		if ( validationResult.clientId === clientId ) {
			return validationResult;
		}

		// Just keep driving down the tree calling until we have found the result.
		if ( validationResult.issues.length > 0 ) {
			const validation = getValidationResultForClientId( clientId, validationResult.issues );
			if ( validation ) {
				return validation;
			}
		}
	}

	// We haven't found the result down this tree.
	return null;
}*/
