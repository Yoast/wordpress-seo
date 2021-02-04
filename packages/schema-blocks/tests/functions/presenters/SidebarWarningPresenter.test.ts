import { select } from "@wordpress/data";
import { getBlockType } from "../../../src/functions/BlockHelper";
import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import getWarnings, { createWarningMessages, sanitizeBlockName } from "../../../src/functions/presenters/SidebarWarningPresenter";

const validations: Record<string, BlockValidationResult> = {};
const blockTypes: Record<string, string> = {};

jest.mock( "@wordpress/data", () => {
	return {
		select: jest.fn( () => {
			return {
				getSchemaBlocksValidationResults: jest.fn( () => {
					return {
						validations,
					};
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

describe( "The createWarningMessage method ", () => {
	it( "creates no warning messages for valid blocks.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Valid );

		const result = createWarningMessages( testcase );

		expect( result ).toEqual( [] );
	} );

	it( "creates no warning messages for validations we have no copy for.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Skipped );

		const result = createWarningMessages( testcase );

		expect( result ).toEqual( [] );
	} );

	it( "creates warning messages for missing attributes, with a footer message.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid );
		testcase.issues.push( new BlockValidationResult( null, "missingblockattribute", BlockValidation.MissingAttribute ) );

		const result = createWarningMessages( testcase );

		expect( result.length ).toEqual( 2 );
		expect( result[ 0 ] ).toEqual( "The 'mijnblock missingblockattribute' block is empty." );
		expect( result[ 1 ] ).toEqual( "Not all required blocks are completed! No recipe schema will be generated for your page." );
	} );

	it( "creates warning messages for missing blocks, with a footer message.", () => {
		const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid );
		testcase.issues.push( new BlockValidationResult( null, "missingblock", BlockValidation.MissingBlock ) );

		const result = createWarningMessages( testcase );

		expect( result.length ).toEqual( 2 );
		expect( result[ 0 ] ).toEqual( "The 'mijnblock missingblock' block is required but missing." );
		expect( result[ 1 ] ).toEqual( "Not all required blocks are completed! No recipe schema will be generated for your page." );
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

		expect( results ).toMatchObject( [ "blok", "blok", "blok", "blok", "blok/" ] );
	} );
} );

describe( "The getWarnings method ", () => {
	it( "creates no warnings for valid blocks.", () => {
		validations[ "1" ] = new BlockValidationResult( "1", "myBlock", BlockValidation.Valid );

		const result = getWarnings( "1" );

		expect( result ).toEqual( null );
	} );

	it( "creates no warnings for validations we have no copy for.", () => {
		const testcase = new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid );
		testcase.issues.push( new BlockValidationResult( "2", "innerblock1", BlockValidation.Skipped ) );
		testcase.issues.push( new BlockValidationResult( "3", "anotherinnerblock", BlockValidation.TooMany ) );
		testcase.issues.push( new BlockValidationResult( "4", "anotherinnerblock", BlockValidation.Unknown ) );
		validations[ "1" ] = testcase;

		const result = getWarnings( "1" );

		expect( result ).toEqual( null );
	} );
} );
