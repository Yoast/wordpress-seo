import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import getWarnings, { createAnalysisMessages } from "../../../src/functions/presenters/SidebarWarningPresenter";

const validations: Record<string, BlockValidationResult> = {};

jest.mock( "@wordpress/data", () => {
	return {
		select: jest.fn( () => {
			return {
				getSchemaBlocksValidationResults: jest.fn( () => {
					return validations;
				} ),
			};
		} ),
	};
} );

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getHumanReadableBlockName: jest.fn( name => name ),
	};
} );

describe( "The SidebarWarningPresenter ", () => {
	describe( "The createAnalysisMessages method ", () => {
		it( "creates a compliment for valid blocks.", () => {
			const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Valid );

			const result = createAnalysisMessages( testcase );

			expect( result ).toEqual( [ { text: "Good job! All required blocks are completed.", color: "green" } ] );
		} );

		it( "creates a compliment for validation results we have no copy for.", () => {
			const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Skipped );

			const result = createAnalysisMessages( testcase );

			expect( result ).toEqual( [ { text: "Good job! All required blocks are completed.", color: "green" } ] );
		} );

		it( "creates warning messages for missing blocks, with a footer message.", () => {
			const testcase = new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid );
			testcase.issues.push(
				new BlockValidationResult(
					null,
					"missingblock",
					BlockValidation.MissingBlock,
					"The 'missingblock' block is required but missing.",
				),
			);

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 2 );
			expect( result[ 0 ] ).toEqual( {
				text: "The 'missingblock' block is required but missing.",
				color: "red",
			} );
			expect( result[ 1 ] ).toEqual(
				{
					text: "Not all required blocks are completed! No mijnblock schema will be generated for your page.",
					color: "red",
				},
			);
		} );
	} );

	describe( "The getWarnings method ", () => {
		it( "creates a compliment for valid blocks.", () => {
			validations[ "1" ] = new BlockValidationResult( "1", "myBlock", BlockValidation.Valid );

			const result = getWarnings( "1" );

			expect( result ).toEqual( [ { text: "Good job! All required blocks are completed.", color: "green" } ] );
		} );

		it( "creates a compliment if we do not have copy for any of the validations.", () => {
			const testcase = new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid );
			testcase.issues.push( new BlockValidationResult( "2", "innerblock1", BlockValidation.Skipped ) );
			testcase.issues.push( new BlockValidationResult( "3", "anotherinnerblock", BlockValidation.TooMany ) );
			testcase.issues.push( new BlockValidationResult( "4", "anotherinnerblock", BlockValidation.Unknown ) );
			validations[ "1" ] = testcase;

			const result = getWarnings( "1" );

			expect( result ).toEqual( [ { text: "Good job! All required blocks are completed.", color: "green" } ] );
		} );

		it( "creates a warning for a block with validation problems.", () => {
			const testcase = new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid );
			testcase.issues.push(
				new BlockValidationResult( "2", "innerblock1", BlockValidation.MissingBlock, "The 'innerblock1' block is required but missing." ),
			);
			validations[ "1" ] = testcase;

			const result = getWarnings( "1" );

			expect( result.length ).toEqual( 2 );
			expect( result[ 0 ] ).toEqual( {
				text: "The 'innerblock1' block is required but missing.",
				color: "red",
			} );
			expect( result[ 1 ] ).toEqual( {
				text: "Not all required blocks are completed! No myblock schema will be generated for your page.",
				color: "red",
			} );
		} );
	} );
} );
