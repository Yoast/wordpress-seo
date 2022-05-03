import { InstructionOptions } from "../Instruction";
import { SuggestedBlockProperties } from "./SuggestedBlockProperties";

/**
 * Defines a required innerblock.
 */
export type RequiredBlock = InstructionOptions & SuggestedBlockProperties & {
	name: string;
	warning?: string;
}
