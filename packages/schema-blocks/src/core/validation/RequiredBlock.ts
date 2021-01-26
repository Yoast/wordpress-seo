import { RequiredBlockOption } from ".";
import { InstructionOptions } from "../Instruction";
import { SuggestedBlockDefinition } from "./SuggestedBlockDefinition";

/**
 * Defines a required innerblock.
 */
export type RequiredBlock = InstructionOptions & SuggestedBlockDefinition & {
	name: string;
	warning?: string;
	option: RequiredBlockOption;
}
