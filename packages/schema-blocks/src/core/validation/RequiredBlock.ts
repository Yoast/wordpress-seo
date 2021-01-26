import { RequiredBlockOption } from ".";
import { InstructionOptions } from "../Instruction";
import { SuggestedBlockProperties } from "./SuggestedBlockDefinition";

/**
 * Defines a required innerblock.
 */
export type RequiredBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
	option: RequiredBlockOption;
}
