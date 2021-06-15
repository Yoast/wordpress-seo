import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import { createAnalysisMessages } from "../../../src/functions/presenters/SidebarWarningPresenter";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";
import { BlockInstance } from "@wordpress/blocks";

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getHumanReadableBlockName: jest.fn( ( name: string ) => name ),
	};
} );

describe( "The SidebarWarningPresenter ", () => {
	describe( "The createAnalysisMessages method ", () => {
		it( "creates a compliment for valid blocks.", () => {
			const testcase = [ new BlockValidationResult( "1", "mijnblock", BlockValidation.Valid, BlockPresence.Required ) ];

			const result = createAnalysisMessages( testcase );

			expect( result ).toEqual( [ {
				text: "Good job! All required information has been provided.",
				color: "green",
			} ] );
		} );

		it( "creates a compliment for validation results we have no copy for.", () => {
			const testcase = [ new BlockValidationResult( "1", "mijnblock", BlockValidation.Skipped, BlockPresence.Required ) ];

			const result = createAnalysisMessages( testcase );

			expect( result ).toEqual( [ {
				text: "Good job! All required information has been provided.",
				color: "green",
			} ] );
		} );

		it( "creates a footer message when some required blocks have missing attributes.", () => {
			const testcase = [
				new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid, BlockPresence.Unknown ),
				new BlockValidationResult( null, "missingblockattribute", BlockValidation.MissingRequiredAttribute, BlockPresence.Unknown ),
			];

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 1 );
			expect( result[ 0 ] ).toEqual(
				{
					text: "Not all required information has been provided! No JobPosting schema will be generated for your page.",
					color: "red",
				},
			);
		} );

		it( "creates warning messages for missing required blocks, with a footer message.", () => {
			const testcase = [
				new BlockValidationResult( "1", "mijnblock", BlockValidation.Invalid, BlockPresence.Required )
			];
			const missing = BlockValidationResult.MissingBlock( "missingblock", BlockPresence.Required );
			missing.message = "The `missingblock` block is required but missing.";
			testcase.push( missing );

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 2 );
			expect( result[ 0 ] ).toEqual( {
				text: "The `missingblock` block is required but missing.",
				color: "red",
			} );
			expect( result[ 1 ] ).toEqual(
				{
					text: "Not all required information has been provided! No JobPosting schema will be generated for your page.",
					color: "red",
				},
			);
		} );

		it( "creates a warning for missing recommended blocks, but when no blocks are required, but the conclusion should still be green.", () => {
			const testcase = [
				new BlockValidationResult( "1", "mijnblock", BlockValidation.MissingRecommendedBlock, BlockPresence.Recommended ),
				BlockValidationResult.MissingBlock( "missing recommended block", BlockPresence.Recommended ),
				BlockValidationResult.MissingBlock( "missing recommended block 2", BlockPresence.Recommended ),
			];

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 3 );
			expect( result[ 0 ] ).toEqual( {
				text: "The `missing recommended block` block is recommended but missing.",
				color: "orange",
			} );
			expect( result[ 1 ] ).toEqual( {
				text: "The `missing recommended block 2` block is recommended but missing.",
				color: "orange",
			} );
			expect( result[ 2 ] ).toEqual( {
				text: "Good job! All required information has been provided.",
				color: "green",
			} );
		} );

		it( "creates a warning for missing recommended blocks, but when all required blocks are valid, the conclusion should still be green.", () => {
			const testcase = [
				new BlockValidationResult( "1", "mijnblock", BlockValidation.MissingRecommendedBlock, BlockPresence.Recommended ),
				BlockValidationResult.MissingBlock( "missing recommended block", BlockPresence.Recommended ),
				BlockValidationResult.Valid( { name: "valid required block 1", clientId: "1" } as unknown as BlockInstance, BlockPresence.Required ),
			];

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 2 );
			expect( result[ 0 ] ).toEqual( {
				text: "The `missing recommended block` block is recommended but missing.",
				color: "orange",
			} );
			expect( result[ 1 ] ).toEqual( {
				text: "Good job! All required information has been provided.",
				color: "green",
			} );
		} );
	} );

	describe( "The createAnalysisMessages method ", () => {
		it( "creates a compliment for required valid blocks.", () => {
			const validation = [
				new BlockValidationResult( "1", "myBlock", BlockValidation.Valid, BlockPresence.Required ),
			];

			const result = createAnalysisMessages( validation );

			expect( result ).toEqual( [ {
				text: "Good job! All required information has been provided.",
				color: "green",
			} ] );
		} );

		it( "creates a warning for a required block with validation problems.", () => {
			const testcase = [
				new BlockValidationResult( "1", "myBlock", BlockValidation.Invalid, BlockPresence.Required ),
				BlockValidationResult.MissingBlock( "block1", BlockPresence.Required ),
			];

			const result = createAnalysisMessages( testcase );

			expect( result.length ).toEqual( 2 );
			expect( result[ 0 ] ).toEqual( {
				text: "The `block1` block is required but missing.",
				color: "red",
			} );
			expect( result[ 1 ] ).toEqual( {
				text: "Not all required information has been provided! No JobPosting schema will be generated for your page.",
				color: "red",
			} );
		} );

		it( "creates no output when the validation results cannot be retrieved.", () => {
			const result = createAnalysisMessages( null );

			expect( result ).toEqual( [] );
		} );
	} );
} );
