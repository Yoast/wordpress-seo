import "../../matchMedia.mock";
import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import validateMany from "../../../src/functions/validators/validateMany";

describe( "The validateMany function", () => {
	it( "considers a group of Valid and Unknown blocks to be Valid.", () => {
		// Arrange.
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Valid ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.Unknown ),
		];

		// Act.
		const result = validateMany( validation );

		// Assert.
		expect( result.clientId ).toEqual( "validatedId" );
		expect( result.name ).toEqual( "validatedBlock" );
		expect( result.result ).toEqual( BlockValidation.Valid );
	} );

	it( "considers a group of non-Valid blocks to be Invalid.", () => {
		// Arrange.
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Invalid ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingAttribute ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingBlock ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.TooMany ),
		];

		// Act.
		const result = validateMany( validation );

		// Assert.
		expect( result.clientId ).toEqual( "validatedId" );
		expect( result.name ).toEqual( "validatedBlock" );
		expect( result.result ).toEqual( BlockValidation.Invalid );
	} );

	it( "considers a mix of Valid and non-Valid blocks to be Invalid.", () => {
		// Arrange.
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Valid ),
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Unknown ),
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Invalid ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingAttribute ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingBlock ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.TooMany ),
		];

		// Act.
		const result = validateMany( validation );

		// Assert.
		expect( result.clientId ).toEqual( "validatedId" );
		expect( result.name ).toEqual( "validatedBlock" );
		expect( result.result ).toEqual( BlockValidation.Invalid );
	} );
} );
