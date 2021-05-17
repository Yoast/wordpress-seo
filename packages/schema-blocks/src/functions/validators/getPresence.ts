import { BlockPresence } from "../../core/validation";
import { InstructionOptions } from "../../core/Instruction";

/**
 * Converts the presence requirements of a particular element to a BlockPresence variable.
 * @param options The block's options.
 * @returns The requirements converted to BlockPresence.
 */
export function getPresence( options: InstructionOptions ) {
	if ( ! options || options.required === "undefined" ) {
		return BlockPresence.Unknown;
	}

	if ( options.required === true ) {
		return BlockPresence.Required;
	}

	if ( options.required === false ) {
		return BlockPresence.Recommended;
	}
}
