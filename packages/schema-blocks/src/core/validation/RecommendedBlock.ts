import { InstructionOptions } from "../Instruction";
import { SuggestedBlockDefinition } from "./SuggestedBlockDefinition";

/**
 * Defines a recommended innerblock.
 */
export type RecommendedBlock = InstructionOptions & SuggestedBlockDefinition & {
	name: string;
	warning?: string;
}
