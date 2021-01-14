import BlockInstruction from "../../src/core/blocks/BlockInstruction";
import Definition from "../../src/core/Definition";
import { BlockValidation, BlockValidationResult } from "../../src/core/validation";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
/**
 * Test class, to be able to test the methods in the abstract Definition class.
 */
class TestDefinition extends Definition {
	/**
     * Required method from base class.
     */
	register(): void {
		// Not needed for our test.
	}
}

/**
 * Simplified Test instruction for use in unit tests.
 */
class TestInstruction extends BlockInstruction {
	private result: BlockValidation;
	private static next_id = 1;
	public configured: boolean;

	/**
     * Creates a simplified BlockInstruction for use in unit tests
     * @param name   The name of the validated blockinstance.
     * @param result The output of validation method for the instance.
     */
	constructor( name: string, result: BlockValidation ) {
		super( TestInstruction.next_id++, { name: name} );
		this.result = result;
		this.configured = false;
	}

	/**
	 * Returns the configuration of this instruction.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		this.configured = true;
		return {};
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
     * Validates nothing - just returns the constructor parameter.
     * @param blockInstance Unused requirement of the base class.
     * @returns {BlockValidationResult[]} The constructor parameter wrapped in an array.
     */
	validate( blockInstance: BlockInstance ): BlockValidationResult[] {
		return [ new BlockValidationResult( "id" + this.id, "test", this.result ) ];
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */
}

describe( "The Definition class", () => {
	it( "validates against all known instructions", () => {
		// Arrange.
		const testInstructions = {
			test1: new TestInstruction( "test1", BlockValidation.Valid ),
			test2: new TestInstruction( "test2", BlockValidation.Missing ),
		};
		const testCase = new TestDefinition( "", "", testInstructions, null );

		// Act.
		const result = testCase.validate( null );

		// Assert.
		expect( result[ 0 ].name ).toEqual( "test" );
		expect( result[ 0 ].clientId ).toEqual( "id1" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.Valid );
		expect( result[ 1 ].name ).toEqual( "test" );
		expect( result[ 1 ].clientId ).toEqual( "id2" );
		expect( result[ 1 ].result ).toEqual( BlockValidation.Missing );
	} );

	it( "configures all known instructions", () => {
		// Arrange.
		const testInstructions = {
			test1: new TestInstruction( "test1", BlockValidation.Valid ),
			test2: new TestInstruction( "test2", BlockValidation.Missing ),
		};
		const testCase = new TestDefinition( "", "", testInstructions, null );

		// Act.
		const result = testCase.configuration();

		// Assert.
		Object.values( result ).every( instruction => expect( ( instruction as TestInstruction ).configured ).toBe( true ) );
	} );
} );
