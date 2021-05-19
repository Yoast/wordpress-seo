import Schema from "../../../src/instructions/schema/Schema";
import { InstructionOptions } from "../../../dist/core/Instruction";

describe( "The Schema schema instruction", () => {
	it( "Returns the options as configuration.", () => {
		// A job location schema element that is required for the job posting schema.
		const options: InstructionOptions = {
			name: "yoast/job-location",
			onlyNested: false,
			requiredFor: [ "yoast/job-posting" ],
		}

		const instruction = new Schema( 1, options );

		expect( instruction.configuration() ).toEqual( options );
	} );

	it( "does not render any Schema itself.", () => {
		// A job location schema element that is required for the job posting schema.
		const options: InstructionOptions = {
			name: "yoast/job-location",
			onlyNested: false,
			requiredFor: [ "yoast/job-posting" ],
		}

		const instruction = new Schema( 1, options );

		expect( instruction.renderable() ).toEqual( false );
	} );
} );
