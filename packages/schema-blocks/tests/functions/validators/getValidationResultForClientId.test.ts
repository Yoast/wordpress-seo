import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";
import { getValidationResultForClientId } from "../../../src/functions/validators";

let input: BlockValidationResult[] = [];

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getHumanReadableBlockName: jest.fn( ( name: string ) => name ),
	};
} );

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
		select: jest.fn( () => {
			return {
				getSchemaBlocksValidationResults: jest.fn(),
			};
		} ),
		dispatch: jest.fn( () => null ),
	};
} );

describe( "The getValidationResultForClientId function ", () => {
	it( "returns null if no validation is found for the given clientId", () => {
		// Arrange.
		input = defaultTestInput;

		// Act.
		const result = getValidationResultForClientId( "clientId does not occur in list", input );

		// Assert.
		expect( result ).toBeNull();
	} );

	it( "retrieves the validation results from the store if none are passed as argument.", () => {
		// Arrange.
		input = [];

		// Act.
		const result = getValidationResultForClientId( "clientId does not occur in list", null );

		// Assert.
		expect( select ).toBeCalled();
		expect( result ).toBeNull();
	} );

	it( "returns the validationResult for the clientId if it is at root level", () => {
		// Arrange.
		input = defaultTestInput;
		input.push( nestedValidationResult );

		// Act.
		const validation = getValidationResultForClientId( "BlockWithNestedIssues", input );

		// Assert.
		expect( validation ).not.toBeNull();
		expect( validation.result ).toBe( BlockValidation.Invalid );
	} );

	it( "returns the validationResult for the clientId if it is nested 1 level deep", () => {
		// Arrange.
		input = defaultTestInput;
		input.push( nestedValidationResult );

		// Act.
		const validation = getValidationResultForClientId( "NestedBlockwithIssues", input );

		// Assert.
		expect( validation ).not.toBeNull();
		expect( validation.result ).toBe( BlockValidation.MissingRequiredVariation );
	} );

	it( "returns the validationResult for the clientId if it is nested more than 1 level deep", () => {
		// Arrange.
		input = defaultTestInput;
		input[ 0 ].issues.push( nestedValidationResult );

		// Act.
		const validation = getValidationResultForClientId( "NestedBlockwithIssues", input );

		// Assert.
		expect( validation ).not.toBeNull();
		expect( validation.result ).toBe( BlockValidation.MissingRequiredVariation );
	} );
} );
