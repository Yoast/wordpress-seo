import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import getWarnings, { createAnalysisMessages, sanitizeBlockName } from "../../../src/functions/presenters/SidebarWarningPresenter";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";

const validations: Record<string, BlockValidationResult> = {};
const blockTypes: Record<string, string> = {};

jest.mock( "@wordpress/data", () => {
	return {
		select: jest.fn( () => {
			return {
				getSchemaBlocksValidationResults: jest.fn( () => {
					return validations;
				} ),
				getBlockType: jest.fn( ( blockName ) => {
					const title = blockTypes[ blockName ];
					if ( title ) {
						return { title };
					}
					return null;
				} ),
			};
		} ),
	};
} );

describe( "The createAnalysisMessages method ", () => {
	it( "creates a compliment for valid blocks.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Valid, BlockPresence.Required );

		const result = createAnalysisMessages( testcase );

		expect( result ).toEqual( [ { text: "Good job! All required blocks have been completed.", color: "green" } ] );
	} );

	it( "creates a compliment for validation results we have no copy for.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Skipped, BlockPresence.Required );

		const result = createAnalysisMessages( testcase );

		expect( result ).toEqual( [ { text: "Good job! All required blocks have been completed.", color: "green" } ] );
	} );

	it( "creates warning messages for missing attributes, with a footer message.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid, BlockPresence.Required );
		testcase.issues.push( new BlockValidationResult( null, "missingblockattribute", BlockValidation.MissingAttribute, BlockPresence.Required ) );

		const result = createAnalysisMessages( testcase );

		expect( result.length ).toEqual( 2 );
		expect( result[ 0 ] ).toEqual( { text: "The 'missingblockattribute' block is empty.", color: "red" } );
		expect( result[ 1 ] ).toEqual(
			{
				text: "Not all required blocks have been completed! No mijnblock schema will be generated for your page.",
				color: "red",
			},
		);
	} );

	it( "creates warning messages for missing required blocks, with a footer message.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid, BlockPresence.Required );
		testcase.issues.push( new BlockValidationResult( null, "missingblock", BlockValidation.MissingBlock, BlockPresence.Required ) );

		const result = createAnalysisMessages( testcase );

		expect( result.length ).toEqual( 2 );
		expect( result[ 0 ] ).toEqual( { text: "The 'missingblock' block is required but missing.", color: "red" } );
		expect( result[ 1 ] ).toEqual(
			{
				text: "Not all required blocks have been completed! No mijnblock schema will be generated for your page.",
				color: "red",
			},
		);
	} );

	it( "creates a warning for missing recommended blocks, but when all the required blocks are present " +
		"the conclusion should still be green.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid, BlockPresence.Recommended );
		testcase.issues.push( new BlockValidationResult( null, "missing recommended block", BlockValidation.MissingBlock, BlockPresence.Recommended ) );
		testcase.issues.push( new BlockValidationResult( null, "missing recommended block 2", BlockValidation.MissingBlock, BlockPresence.Recommended ) );

		const result = createAnalysisMessages( testcase );

		expect( result.length ).toEqual( 3 );
		expect( result[ 0 ] ).toEqual( { text: "The 'missing recommended block' block is recommended but missing.", color: "orange" } );
		expect( result[ 1 ] ).toEqual( { text: "The 'missing recommended block 2' block is recommended but missing.", color: "orange" } );
		expect( result[ 2 ] ).toEqual( { text: "Good job! All required blocks have been completed.", color: "green" } );
	} );
} );

describe( "The sanitizeBlockName method ", () => {
	it( "returns a block title from the wordpress store based on its name", () => {
		blockTypes[ "yoast/testblock" ] = "testBlockWithoutPrefix";

		const result = sanitizeBlockName( "yoast/testblock" );

		expect( result ).toEqual( "testBlockWithoutPrefix" );
	} );

	it( "uses a fallback method to reduce technical block names to human-readable ones.", () => {
		const testcases = [
			"test/blok",
			"test-erde-test/test/blok",
			"/blok",
			"blok",
			"blok/",
		];

		const results = testcases.map( input => sanitizeBlockName( input ) );

		expect( results ).toEqual( [ "blok", "blok", "blok", "blok", "blok/" ] );
	} );
} );

describe( "The getWarnings method ", () => {
	it( "creates a compliment for required valid blocks.", () => {
		validations[ "1" ] = new BlockValidationResult( "1", "myBlock", BlockValidation.Valid, BlockPresence.Required );

		const result = getWarnings( "1" );

		expect( result ).toEqual( [ { text: "Good job! All required blocks have been completed.", color: "green" } ] );
	} );

	it( "creates a compliment if we do not have copy for any of the validations of the required blocks.", () => {
		const testcase = new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid, BlockPresence.Required );
		testcase.issues.push( new BlockValidationResult( "2", "innerblock1", BlockValidation.Skipped, BlockPresence.Required ) );
		testcase.issues.push( new BlockValidationResult( "3", "anotherinnerblock", BlockValidation.TooMany, BlockPresence.Required ) );
		testcase.issues.push( new BlockValidationResult( "4", "anotherinnerblock", BlockValidation.Unknown, BlockPresence.Required ) );
		validations[ "1" ] = testcase;

		const result = getWarnings( "1" );

		expect( result ).toEqual( [ { text: "Good job! All required blocks have been completed.", color: "green" } ] );
	} );

	it( "creates a warning for a required block with validation problems.", () => {
		const testcase = new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid, BlockPresence.Required );
		testcase.issues.push( new BlockValidationResult( "2", "innerblock1", BlockValidation.MissingBlock, BlockPresence.Required ) );
		validations[ "1" ] = testcase;

		const result = getWarnings( "1" );

		expect( result.length ).toEqual( 2 );
		expect( result[ 0 ] ).toEqual( {
			text: "The 'innerblock1' block is required but missing.",
			color: "red",
		} );
		expect( result[ 1 ] ).toEqual( {
			text: "Not all required blocks have been completed! No myblock schema will be generated for your page.",
			color: "red",
		} );
	} );

	it( "creates no output when the validation results cannot be retrieved.", () => {
		const result = getWarnings( "123" );

		expect( result ).toBeNull();
	} );
} );
