import { SchemaArray } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Job employment type instruction.
 */
export default class JobEmploymentType extends SchemaInstruction {
	public options: {
		name: string;
	}

	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaArray | string {
		const employmentType = block.attributes.employmentType;
		const { isVolunteer, isIntern } = block.attributes;


		if ( ! ( isVolunteer || isIntern ) ) {
			return employmentType;
		}

		const list = [ employmentType ];

		if ( isVolunteer ) {
			list.push( "VOLUNTEER" );
		}

		if ( isIntern ) {
			list.push( "INTERN" );
		}

		return list;
	}
}

SchemaInstruction.register( "job-employment-type", JobEmploymentType );
