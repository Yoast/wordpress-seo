import "../../matchMedia.mock";
import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
import validateMany from "../../../src/functions/validators/validateMany";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";

describe( "The validateMany function", () => {
	it( "considers a group of Valid and Unknown blocks to be Valid.", () => {
		// Arrange.
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown, BlockPresence.Required );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Valid, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.Unknown, BlockPresence.Required ),
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
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown, BlockPresence.Required );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Invalid, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingAttribute, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingRequiredBlock, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.TooMany, BlockPresence.Required ),
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
		const validation = new BlockValidationResult( "validatedId", "validatedBlock", BlockValidation.Unknown, BlockPresence.Required );
		validation.issues = [
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Valid, BlockPresence.Required ),
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Unknown, BlockPresence.Required ),
			new BlockValidationResult( "innerblock1", "innerblock1", BlockValidation.Invalid, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingAttribute, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.MissingRequiredBlock, BlockPresence.Required ),
			new BlockValidationResult( "innerblock2", "innerblock2", BlockValidation.TooMany, BlockPresence.Required ),
		];

		// Act.
		const result = validateMany( validation );

		// Assert.
		expect( result.clientId ).toEqual( "validatedId" );
		expect( result.name ).toEqual( "validatedBlock" );
		expect( result.result ).toEqual( BlockValidation.Invalid );
	} );
} );
